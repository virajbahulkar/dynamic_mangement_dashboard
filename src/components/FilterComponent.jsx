
import {React} from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import DynamicForm from './Dynamic-Components';
import { generateClasses } from '../helpers';

const FilterComponent = (props) => {
  const { setFilters } = useStateContext();
  const { filters, key } = props

  const handleSubmission = (val) => {
    setFilters(val)
  };
    
    return (
      <div  className={generateClasses(filters.style)}>
        <DynamicForm  fields={filters?.fields} submitButton={filters?.submitButton} cbSubmit={handleSubmission}  formStyle="inline" key={key} />
      </div>
    );
} 

export default FilterComponent;