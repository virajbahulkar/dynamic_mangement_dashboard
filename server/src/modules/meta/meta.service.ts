import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { Page, PageDocument } from './schemas/page.schema';
import { Layout, LayoutDocument } from './schemas/layout.schema';
import { FilterForm, FilterFormDocument } from './schemas/filter-form.schema';
import { ComponentDef, ComponentDocument } from './schemas/component.schema';
import { DataSource, DataSourceDocument } from './schemas/data-source.schema';
import { TransformPipeline, TransformPipelineDocument } from './schemas/transform-pipeline.schema';
import { Asset, AssetDocument } from './schemas/asset.schema';
import { ConfigItem, ConfigItemDocument } from './schemas/config-item.schema';
import { FunctionDef, FunctionDefDocument } from './schemas/function-def.schema';
import { defaultFunctionRunner } from './function-runner';
import { transformCache } from './transform-cache.service';

export interface HydratedComponent {
  _id: any;
  kind: string;
  title: string;
  slotPath: string | null;
  props: any;
  style: any;
  interactions: any;
  dataSource: any;
  transformPipeline: any;
  transformedData?: any;
  transformError?: string;
}

@Injectable()
export class MetaService {
  constructor(
    @InjectModel(Application.name) private appModel: Model<ApplicationDocument>,
    @InjectModel(Page.name) private pageModel: Model<PageDocument>,
    @InjectModel(Layout.name) private layoutModel: Model<LayoutDocument>,
    @InjectModel(FilterForm.name) private formModel: Model<FilterFormDocument>,
    @InjectModel(ComponentDef.name) private compModel: Model<ComponentDocument>,
    @InjectModel(DataSource.name) private dsModel: Model<DataSourceDocument>,
    @InjectModel(TransformPipeline.name) private tpModel: Model<TransformPipelineDocument>,
    @InjectModel(ConfigItem.name) private configModel: Model<ConfigItemDocument>,
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
    @InjectModel(FunctionDef.name) private fnModel: Model<FunctionDefDocument>,
  ) {}

  async getHydratedPage(appId: string, slug: string, opts?: { includeAssets?: boolean }) {
    const page = await this.pageModel.findOne({ appId, slug, status: 'active' });
    if (!page) throw new NotFoundException('Page not found');
    const [layout, form] = await Promise.all([
      page.layoutRef ? this.layoutModel.findById(page.layoutRef) : null,
      page.filterFormRef ? this.formModel.findById(page.filterFormRef) : null,
    ]);
    const componentIds = (page.components || []).map(c => c.ref).filter(Boolean) as Types.ObjectId[];
    const components = componentIds.length ? await this.compModel.find({ _id: { $in: componentIds } }) : [];
    const dataSourceIds = components.map(c => c.dataSourceRef).filter(Boolean) as Types.ObjectId[];
    const transformIds = components.map(c => c.transformPipelineRef).filter(Boolean) as Types.ObjectId[];
    const [dataSources, pipelines] = await Promise.all([
      dataSourceIds.length ? this.dsModel.find({ _id: { $in: dataSourceIds } }) : [],
      transformIds.length ? this.tpModel.find({ _id: { $in: transformIds } }) : [],
    ]);
    // Map by id for joining
  const dsEntries: [string, any][] = dataSources.map(d => [d._id.toString(), d] as [string, any]);
  const tpEntries: [string, any][] = pipelines.map(p => [p._id.toString(), p] as [string, any]);
  const dsMap = new Map<string, any>(dsEntries);
  const tpMap = new Map<string, any>(tpEntries);
    const slotPathMap = new Map<string, string>();
    (page.components || []).forEach(c => slotPathMap.set(c.ref.toString(), c.slotPath));
    const hydratedComponents: HydratedComponent[] = components.map(c => ({
      _id: c._id,
      kind: c.kind,
      title: c.title,
      slotPath: slotPathMap.get(c._id.toString()) || null,
      props: c.props,
      style: c.style,
      interactions: c.interactions,
      dataSource: c.dataSourceRef ? dsMap.get(c.dataSourceRef.toString()) : null,
      transformPipeline: c.transformPipelineRef ? tpMap.get(c.transformPipelineRef.toString()) : null
    }));
    // Execute server-side transform pipelines that are marked as eager (future flag) - for now always process.
    for (const comp of hydratedComponents) {
      if (comp.transformPipeline?.steps && Array.isArray(comp.transformPipeline.steps) && comp.dataSource?.sampleData) {
        try {
          const dsId = comp.dataSource._id?.toString();
          const sampleHash = comp.dataSource.sampleHash;
          const planHash = comp.transformPipeline.planHash;
          const cacheKey = transformCache.makeKey([dsId, sampleHash, planHash]);
          const cached = transformCache.get(cacheKey);
          if (cached) { comp.transformedData = cached; continue; }
          let working = comp.dataSource.sampleData;
          for (const step of comp.transformPipeline.steps) {
            if (!step || typeof step !== 'object') continue;
            const { op } = step;
            if (op === 'pickFields' && Array.isArray(step.fields) && Array.isArray(working)) {
              working = working.map(row => {
                const picked = {} as any;
                step.fields.forEach(f => { if (row && Object.prototype.hasOwnProperty.call(row, f)) picked[f] = row[f]; });
                return picked;
              });
            } else if (op === 'filter' && typeof step.expr === 'object' && Array.isArray(working)) {
              // Basic equality filter: { field: value }
              working = working.filter(row => Object.entries(step.expr).every(([k,v]) => row[k] === v));
            } else if (op === 'limit' && typeof step.count === 'number' && Array.isArray(working)) {
              working = working.slice(0, step.count);
            } else if (op === 'map' && Array.isArray(working)) {
              // Support either inline expr or fnRef
              if (step.fnRef && typeof step.fnRef === 'string') {
                try {
                  const fnDef = await this.fnModel.findOne({ name: step.fnRef, status: 'active' });
                  if (fnDef) {
                    working = working.map(r => {
                      try { return defaultFunctionRunner.run({ name: fnDef.name, runtime: fnDef.runtime, code: fnDef.code }, r); } catch { return r; }
                    });
                  }
                } catch { /* ignore */ }
              } else if (typeof step.expr === 'string') {
                try {
                  const fn = new Function('r', `return (${step.expr});`);
                  working = working.map(r => fn(r));
                } catch { /* ignore bad map expr */ }
              }
            }
          }
          comp.transformedData = working;
          transformCache.set(cacheKey, working);
        } catch (e) {
          comp.transformError = (e as Error).message;
        }
      }
    }
    let assets: any[] | undefined = undefined;
    if (opts?.includeAssets && (page.placements && page.placements.length)) {
      const assetIds = page.placements.map(p => p.assetRef).filter(Boolean) as Types.ObjectId[];
      if (assetIds.length) {
        const assetDocs = await this.assetModel.find({ _id: { $in: assetIds }, status: 'active' });
        const byId = new Map(assetDocs.map(a => [a._id.toString(), a]));
        assets = page.placements.map(p => ({ slotPath: p.slotPath, overrides: p.overrides || null, asset: byId.get(p.assetRef.toString()) || null }));
      } else {
        assets = [];
      }
    }
    return { page, layout, filterForm: form, components: hydratedComponents, assets };
  }

  async getConfigItems(appId: string, category: string) {
    const items = await this.configModel.find({ appId, category, status: 'active' });
    // collapse by key (latest version already ensured unique active index)
    return items.map(i => ({ key: i.key, value: i.value }));
  }
}
