import { CreateEntrepriseDto, EntrepriseDto } from "@/types";

export interface IEntrepriseRepository {
  create(data: CreateEntrepriseDto): Promise<EntrepriseDto>;
  findAll(): Promise<EntrepriseDto[]>;
  findById(id: number): Promise<EntrepriseDto | null>;
}
