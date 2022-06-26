import type { FC } from "react";
import { Form } from "react-bootstrap";
import { filterCategory } from "../../types/CatalogTypes";

interface FilterOptionsProps {
    filterCategories: filterCategory[]
}

const FilterOptions: FC<FilterOptionsProps> = function FilterOptions({
    filterCategories
}) {
    return (
        <div>
            <h2>Filter Options</h2>
            {
                filterCategories.map((category, indexX) => {
                    if (category.type === "checkbox" || category.type === "radio") {
                        return (
                            <div key={`${category.name}-${indexX}`}>
                                <div>
                                    { category.name }
                                </div>
                                <div>
                                    <Form>
                                        {
                                            category.options.map((option, indexY) =>{
                                                return (
                                                    <Form.Check
                                                        key={`${option}-${indexX}-${indexY}`}
                                                        id={`${option}-${indexX}-${indexY}`}
                                                        type={category.type}
                                                        name={category.name}
                                                        label={option}
                                                    />
                                                )
                                            })
                                        }
                                    </Form>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}

export default FilterOptions
