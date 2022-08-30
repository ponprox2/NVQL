import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
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
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Box,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import DateRangePicker from './chooseTimeRangePicker';
import { getWareHouseReportAPI, getManagedWarehouseAPI } from '../services/index';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'time', label: 'Thời gian', alignRight: false },
  { id: 'orderQuantityFromShop', label: 'Số đơn hàng nhận từ cửa hàng', alignRight: false },
  { id: 'orderQuantityDeliverInTime', label: 'Số đơn hàng giao thành công đúng hạn', alignRight: false },
  { id: 'orderQuantityDeliverDelayTime', label: 'Số đơn hàng giao thành công trễ hạn', alignRight: false },
  { id: 'orderQuantityCancelled', label: 'Số đơn hàng bị hủy', alignRight: false },
  { id: 'orderQuantityOnceFailed', label: 'Số đơn hàng có lần giao thất bại', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRangePicker, setOpenRangePicker] = useState(false);
  const [timeChoose, setTimeChoose] = useState('');
  const [endTimeChoose, setEndTimeChoose] = useState('');
  const [shopnameChoose, setShopnameChoose] = useState('');
  const [shopname1, setShopname1] = useState([]);
  const [buttonChoose, setButtonChoose] = useState('');

  const [listProduct, setListProduct] = useState([]);
  const staffId = localStorage.getItem('staffID')

  // useEffect(() => {
  //   async function loadListProduct() {
  //     const res = await axios.get('http://localhost:3000/api/v1/products');
  //     setListProduct(res.data);
  //   }
  //   loadListProduct();
  // }, []);

  useEffect(() => {
    let timeEnd1 = '20';
    const timeEnd = endTimeChoose?.split('/');
    for (let i = timeEnd?.length - 1; i >= 0; i -= 1) {
      timeEnd1 += timeEnd[i];
    }
    let timeEnd2 = '20';
    const timeEnd3 = timeChoose?.split('/');
    for (let i = timeEnd3?.length - 1; i >= 0; i -= 1) {
      timeEnd2 += timeEnd3[i];
    }

    const body = {
      warehouseID: shopnameChoose,
      fromDate: timeEnd2,
      toDate: timeEnd1,
      monthlyReport: buttonChoose,
    };
    getWareHouseReport(body);
  }, [endTimeChoose, timeChoose, shopnameChoose, buttonChoose]);
  useEffect(() => {
    getManagedWarehouse(staffId);
  }, []);

  const getWareHouseReport = async (body) => {
    try {
      const res = await getWareHouseReportAPI(body);
      if (res?.status === 200) {
        setListProduct(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getManagedWarehouse = async (id) => {
    try {
      const res = await getManagedWarehouseAPI(id);
      console.log(res);
      setShopname1(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listProduct.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const renderAddress = (id) => {
    const res = shopname1?.filter((e) => e?.warehouseID === id);
    return res?.[0]?.address;
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listProduct.length) : 0;

  const filteredUsers = applySortFilter(listProduct, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Product">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Thống Kê Kho
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/addProduct"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New product
          </Button> */}
        </Stack>
        <Box style={{ marginBottom: '30px' }}>
          <Box style={{ display: 'flex' }}>
            <Box>Nhà kho</Box>
            <FormControl style={{ marginTop: '-5px', marginLeft: '125px' }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ height: '30px' }}
                value={shopnameChoose}
                onChange={(e) => setShopnameChoose(e?.target?.value)}
              >
                {shopname1?.map((e) => (
                  <MenuItem value={e?.warehouseID}>{e?.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
            <Box>Địa chỉ kho</Box>
            <Box style={{ marginLeft: '105px' }}>{renderAddress(shopnameChoose)}</Box>
          </Box>

          <Box style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
            <Box >Thời gian thống kê</Box>
             <Box onClick={() => setOpenRangePicker(true)}
             style={{ marginLeft: '50px' }}>
                {timeChoose}  -  {endTimeChoose}{' '}
            </Box>
          </Box>


          {/* <Box onClick={() => setOpenRangePicker(true)}>
            Thời gian thống kê {timeChoose} - {endTimeChoose}{' '}
          </Box> */}

          <DateRangePicker
            openTime={openRangePicker}
            setOpenTime={setOpenRangePicker}
            timeChoose={timeChoose}
            setTimeChoose={setTimeChoose}
            endTimeChoose={endTimeChoose}
            setEndTimeChoose={setEndTimeChoose}
          />
        </Box>
        <Box style={{ display: 'flex', width: '400px', justifyContent: 'space-between', marginBottom: '30px' }}>
          <Button variant="contained" onClick={() => setButtonChoose(0)}>
            Thống Kê Theo Ngày
          </Button>
          <Button variant="contained" onClick={() => setButtonChoose(1)}>
            Thống Kê Theo Tháng
          </Button>
        </Box>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listProduct.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      orderQuantityOnceFailed,
                      orderQuantityCancelled,
                      orderQuantityDeliverDelayTime,
                      orderQuantityDeliverOnTime,
                      orderQuantityFromShop,
                      time,
                    } = row;
                    const isItemSelected = selected.indexOf(time) !== -1;

                    return (
                      <TableRow
                        hover
                        key={time}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} /> */}
                        </TableCell>

                        <TableCell align="center">{time}</TableCell>
                        <TableCell align="center">{orderQuantityFromShop}</TableCell>
                        <TableCell align="center">{orderQuantityDeliverOnTime}</TableCell>
                        <TableCell align="center">{orderQuantityDeliverDelayTime}</TableCell>
                        <TableCell align="center">{orderQuantityCancelled}</TableCell>
                        <TableCell align="center">{orderQuantityOnceFailed}</TableCell>
                        {/* orderQuantityOnceFailed,
                    orderQuantityCancelled,
                    orderQuantityDeliverDelayTime,
                    orderQuantityDeliverInTime,
                    orderQuantityFromShop,
                    time */}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={listProduct.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
