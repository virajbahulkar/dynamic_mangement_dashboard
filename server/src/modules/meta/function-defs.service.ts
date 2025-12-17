import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FunctionDef, FunctionDefDocument } from './schemas/function-def.schema';
import { createHash } from 'crypto';

interface CreateFunctionDto {
  name: string;
  runtime: string; // js | wasm (future)
  code: string;
  inputSchema?: any;
  outputSchema?: any;
  limits?: { timeoutMs?: number; maxMemoryMb?: number };
  status?: string; // default active
}

@Injectable()
export class FunctionDefsService {
  constructor(@InjectModel(FunctionDef.name) private fnModel: Model<FunctionDefDocument>) {}

  async create(dto: CreateFunctionDto) {
    if (!dto.name || !dto.runtime || !dto.code) {
      throw new BadRequestException('name, runtime, code required');
    }
    const existing = await this.fnModel.findOne({ name: dto.name, status: 'active' });
    if (existing) {
      throw new BadRequestException('Active function with this name already exists');
    }
    const codeHash = createHash('sha256').update(dto.code, 'utf8').digest('hex');
    const doc = await this.fnModel.create({
      name: dto.name,
      runtime: dto.runtime,
      code: dto.code,
      codeHash,
      inputSchema: dto.inputSchema,
      outputSchema: dto.outputSchema,
      limits: dto.limits,
      status: dto.status || 'active'
    } as any);
    // Return metadata only (omit code)
    return this.stripCode(doc);
  }

  async list() {
    const docs = await this.fnModel.find({ status: { $in: ['active','draft'] } }).sort({ name: 1 });
    return docs.map(d => this.stripCode(d));
  }

  async getByName(name: string) {
    const doc = await this.fnModel.findOne({ name, status: { $in: ['active','draft'] } });
    if (!doc) throw new NotFoundException('Function not found');
    return this.stripCode(doc);
  }

  async getRawByName(name: string) { // internal use (includes code)
    const doc = await this.fnModel.findOne({ name, status: { $in: ['active','draft'] } });
    if (!doc) throw new NotFoundException('Function not found');
    return doc;
  }

  private stripCode(doc: FunctionDefDocument) {
    const { code, __v, ...rest } = doc.toObject();
    return { ...rest, hasCode: !!code };
  }
}
