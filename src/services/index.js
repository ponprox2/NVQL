import axios from 'axios';
import {
  API_GET_FREE_SHIPPER,
  API_GET_WORKING_TERRITORY,
  API_GET_REGION,
  API_UPDATE_DELIVERY_HISTORY,
  API_GET_UPDATE_DETAIL_PACKAGE,
  API_GET_SHOP_ORDER_CONFIRM,
  API_GET_DETAIL_PACKAGE,
  API_GET_SHOP_ORDER_HISTORY,
  API_LOGIN,
  API_SHOP_ORDER_MANAGED,
  API_TERITORIES_MANAGED,
  API_SHOP_NAME,
  API_GET_PACKET_STATUS,
  API_GET_WAREHOUSE_REPORT,
  API_GET_MANAGED_WAREHOUSE
} from './config';

export const getWorkingTerritory = async (id) => {
  try {
    const response = await axios.get(`${API_GET_WORKING_TERRITORY}?staffID=${id}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getManagedWarehouseAPI = async (id) => {
  try {
    const response = await axios.get(`${API_GET_MANAGED_WAREHOUSE}?managerID=${id}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getWareHouseReportAPI = async (body) => {
  try {
    const response = await axios.get(
      `${API_GET_WAREHOUSE_REPORT}?warehouseID=${body?.warehouseID}&fromDate=${body?.fromDate}&toDate=${body?.toDate}&monthlyReport=${body?.monthlyReport}`
    );
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getRegion = async (id) => {
  try {
    const response = await axios.get(`${API_GET_REGION}?territoryID=${id}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getDetailPackage = async (id) => {
  try {
    const response = await axios.get(`${API_GET_UPDATE_DETAIL_PACKAGE}?shopOrderID=${id}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getFreeShiper = async (id) => {
  try {
    const response = await axios.get(`${API_GET_FREE_SHIPPER}?shopOrderID=${id}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const updateDeliveryHistory = async (body) => {
  try {
    const response = await axios.put(API_UPDATE_DELIVERY_HISTORY, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getShopOrdersConfirming = async (body) => {
  try {
    const response = await axios.get(
      `${API_GET_SHOP_ORDER_CONFIRM}?staffID=${body?.staffID}&regionID=${body?.regionID}&deliveryStatus=${body?.status}`
    );
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getDetailPackageAPI = async (body) => {
  try {
    const response = await axios.get(
      `${API_GET_DETAIL_PACKAGE}?shopOrderID=${body?.shopOrderID}&isDetails=${body?.isDetail}`
    );
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getShopOrderHistoryAPI = async (shopOrderID) => {
  try {
    const response = await axios.get(`${API_GET_SHOP_ORDER_HISTORY}?shopOrderID=${shopOrderID}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const loginAPI = async (body) => {
  try {
    const response = await axios.post(API_LOGIN, body);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getShopOrderManagedAPI = async (body) => {
  try {
    const response = await axios.get(
      `${API_SHOP_ORDER_MANAGED}?managerID=${body?.managerID}&shopID=${body.shopId}&territoryID=${body?.territoryID}&regionID=${body?.regionID}&statusID=${body.statusID}`
    );
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getTeritoryManagedAPI = async (managerID) => {
  try {
    const response = await axios.get(`${API_TERITORIES_MANAGED}?managerID=${managerID}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getShopNameAPI = async () => {
  try {
    const response = await axios.get(`${API_SHOP_NAME}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
export const getPacketStatusAPI = async () => {
  try {
    const response = await axios.get(`${API_GET_PACKET_STATUS}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
