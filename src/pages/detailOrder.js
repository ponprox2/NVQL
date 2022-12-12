import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  Divider,
} from '@mui/material';
// components
import axios from 'axios';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import TableProduct from './tableDetailProduct';
import { getDetailPackageAPI, getShopOrderHistoryAPI } from '../services/index';

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', alignRight: false },
  { id: 'time', label: 'Thời gian', alignRight: false },
  { id: 'staffType', label: 'Loại nhân viên', alignRight: false },
  { id: 'staffName', label: 'Tên nhân viên', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
];

function DetailOrder() {
  const { search } = useLocation();
  const id = search.split('=')[1];

  const [orderDetail, setOrderDetail] = useState({});
  const [listOrderDetail, setListOrderDetail] = useState([]);

  const getDetailPackage = async (body) => {
    try {
      const res = await getDetailPackageAPI(body);
      setOrderDetail(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getShopOrderHistory = async (id) => {
    try {
      const res = await getShopOrderHistoryAPI(id);
      if (res?.data) {
        setListOrderDetail(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const body = {
      shopOrderID: id,
      isDetail: 1,
    };
    getDetailPackage(body);
    getShopOrderHistory(id);
  }, []);

  return (
    <>
      <Box>
        <Box style={{ margin: '20px 0px 50px 30px' }}> Lịch Sử Đơn Hàng</Box>
        <Box style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <Box width="49%">
            <h2 style={{ lineHeight: '30px' }}>Cửa hàng</h2>
            <Divider />
            <Typography style={{ lineHeight: '30px' }}>Mã đơn hàng : {orderDetail?.shopOrderID}</Typography>
            <Typography style={{ lineHeight: '25px' }}>Tên cửa hàng: {orderDetail?.shopName}</Typography>
            <Typography style={{ lineHeight: '25px' }}>Chủ cửa hàng: {orderDetail?.shopkeeperName}</Typography>
            <Typography style={{ lineHeight: '25px' }}>Địa Chỉ : {orderDetail?.shopAddress}</Typography>
            <Typography style={{ lineHeight: '30px' }}>Email : {orderDetail?.shopEmail}</Typography>
            <Typography style={{ lineHeight: '25px' }}>SĐT: {orderDetail?.shopPhone}</Typography>

            <Typography style={{ lineHeight: '25px' }}>Thời Gian Đăng Ký : {orderDetail?.registerDate}</Typography>
          </Box>
          <Box width="49%">
            <h2 style={{ lineHeight: '30px' }}>Hàng hoá</h2>
            <Divider />
            <Typography style={{ lineHeight: '30px' }}>Tên món hàng : {orderDetail?.packageName} </Typography>

            <Typography style={{ lineHeight: '25px' }}>Số lượng : {orderDetail?.quantity}</Typography>
            <Typography style={{ lineHeight: '25px' }}>Khối lượng : {orderDetail?.mass}</Typography>
            <Typography style={{ lineHeight: '30px' }}>Đơn giá : {orderDetail?.unitPrice} vnđ</Typography>

            <Typography style={{ lineHeight: '25px' }}>Phí vận chuyển : {orderDetail?.shippingFee} vnđ</Typography>
            <Typography style={{ lineHeight: '25px' }}>Tổng tiền : {orderDetail?.totalPrice} vnđ</Typography>
            <Typography style={{ lineHeight: '30px' }}>
              Thanh toán phí vận chuyển : {orderDetail?.shippingFeePayment ? 'Chưa thanh toán' : 'Đã thanh toán'}
            </Typography>

            <Typography style={{ lineHeight: '25px' }}>
              Thanh toán toàn bộ : {orderDetail?.fullPayment ? 'Chưa thanh toán' : 'Đã thanh toán'}{' '}
            </Typography>
          </Box>
        </Box>
        <Box width="90%" m="auto">
          <h2 style={{ lineHeight: '30px' }}>Người nhận</h2>
          <Divider />
          <Typography style={{ lineHeight: '30px' }}>Họ và tên : {orderDetail?.consigneeName}</Typography>
          <Typography style={{ lineHeight: '25px' }}>SĐT : {orderDetail?.consigneePhone}</Typography>
          <Typography style={{ lineHeight: '25px' }}>Ghi chú : {orderDetail?.consignneNote}</Typography>
          <Typography style={{ lineHeight: '25px' }}>Địa chỉ giao hàng : {orderDetail?.deliveryAddress}</Typography>
        </Box>
        <Box
          style={{
            width: '80%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-evenly',
            marginTop: '50px',
          }}
        >
          <Table>
            <UserListHead headLabel={TABLE_HEAD} />
            <TableBody>
              {listOrderDetail?.map((value, index) => (
                <TableRow hover tabIndex={-1} role="checkbox">
                  <TableCell padding="checkbox">{/* <Checkbox /> */}</TableCell>

                  <TableCell align="left">{index+1}</TableCell>
                  <TableCell align="left">{value?.time}</TableCell>
                  <TableCell align="left">{value?.staffType}</TableCell>
                  <TableCell align="left">{value?.staffName ? value?.staffName : 'Cửa hàng'}</TableCell>
                  <TableCell align="left"><strong>{value?.status}</strong> </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </>
  );
}

export default DetailOrder;
