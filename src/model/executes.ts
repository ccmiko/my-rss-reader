export type ExecuteType = {
  id: string;
  lastSucceedDt: Date;
};

export class Execute implements ExecuteType {
  id: string;
  lastSucceedDt: Date;

  constructor(id: string, lastSucceedDt: Date) {
    this.id = id;
    this.lastSucceedDt = lastSucceedDt;
  }
}
