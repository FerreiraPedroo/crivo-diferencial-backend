export class OrderServiceController {
  constructor() {}
  static async getOrderService(req, res, next) {
    const { userLoged } = req;
    const { osIDs } = req.query;

    let osIDsList = "";
    if (osIDs) {
      osIDsList = osIDs.split("|");
    }

    const osService = new orderServiceService();

    const osList = osService.getOrderServiceList({ userLoged, osIDsList });

    console.log(osIDs);
  }
}
