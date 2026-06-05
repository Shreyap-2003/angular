export interface ItemsDto {

  id: number;

  name: string;

  price: number;

  imageUrl: string;

  createdDate: string;

  lastModifiedDate: string;

  subCategoryId: number;

  quantity?: number;
}