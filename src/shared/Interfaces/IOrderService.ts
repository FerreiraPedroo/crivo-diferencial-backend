export interface IOrderService {
  readonly id: number;
  user_id: number;
  localization_name: string;
  localization: string;
  coordinates: {
    x: number;
    y: number;
  };
  date_created: string;
  date_finished: string;
  status: "Aberto" | "Finalizado" | "Sincronizado";
  description: string | null;
  comment: string | null;
}