export interface CreateCategoryRequest{
    name: string;
    active?: boolean;
    createdBy: string;
}

export interface UpdateCategoryRequest{
    name: string;
    active?: boolean;
}