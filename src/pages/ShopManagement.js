import { filter } from 'lodash';
import { useState, useEffect } from 'react';
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
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import SimpleDialog from './DetailOrderView';
// mock
import {
    getShopsAPI,
    banShopAPI,
  } from '../services/index';
import DialogApp from './Dialog';
import ConfirmDlg from './ConfirmDlg';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'shopID', label: 'Mã cửa hàng', alignRight: false },
  { id: 'shopName', label: 'Tên cửa hàng', alignRight: false },
  { id: 'shopkeeperName', label: 'Chủ cửa hàng', alignRight: false },
  { id: 'address', label: 'Địa chỉ cửa hàng', alignRight: false },
  { id: 'email ', label: 'Email liên hệ', alignRight: false },
  { id: 'phone ', label: 'SĐT liên hệ', alignRight: false },
  { id: 'registerDate ', label: 'Ngày đăng ký', alignRight: false },
  { id: 'banned ', label: 'Lệnh cấm', alignRight: false },
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
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [error1, setError1] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [shopName, setShopName] = useState('');
  const [priceInput, setPriceInput] = useState(0);
  const staffId = localStorage.getItem('staffID');
  const [reCall, setReCall] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [severity, setSeverity] = useState('');
  const [itemProp, setItemProp] = useState({});
  const [open, setOpen] = useState(false);

  const [listUser, setListUser] = useState([
    {
        shopID: '',
        shopName: '',
        shopkeeperName: '',
        address: '',
        email: '',
        phone: '',
        registerDate: '',
        adminDivision1: '',
        adminDivision2: '',
        adminDivision3: '',
        banned: false,
  },
  ]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [inputValues, setInputVals] = useState({});

  const handleOnConfirm = () => {
    // handleClickStatus(inputValues.banned, inputValues.shopID);
    handleSave();
  }

  const getShops = async (body) => {
    try {
      const res = await getShopsAPI(body);
      console.log(res);
      setListUser(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const banShops = async (body) => {
    try {
      const res = await banShopAPI(body);
      if (res?.status === 200) {
        setOpenToast(true);
        setSeverity('success');
        setError1(res.data);
        setReCall(!reCall);
      }
    } catch (error) {
      setOpenToast(true);
      setSeverity('error');
      setError1(error?.response?.data);
    }
  };

  const convertInputBanned = (banned) =>{
        if(banned === true){
            return "0";
        }
        return "1";
  }

  const handleSave = () => {
    const body = {
      shopID: inputValues.shopID,
      banFlg: convertInputBanned(inputValues.banned),
    };

    banShops(body);
  };

  useEffect(() => {
    const body = {
      shopName,
    };
    getShops(body);
  }, [shopName, reCall]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listUser.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleClickStatus = (banned, id) => {
    const temp = listUser.filter((e) => e.shopID === id);
    const tempArr = listUser.filter((e) => e.shopID !== id);
    let temp1 = [];

    if (banned === false) {
      temp[0].banned = true;
    }
    if (banned === true) {
      temp[0].banned = false;
    }
    temp1 = temp;

    const temp2 = [...temp1, ...tempArr];
    // temp2.sort((a, b) => a.shopOrderID - b.shopOrderID);
    setListUser(temp2);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listUser?.length) : 0;

  const filteredUsers = applySortFilter(listUser, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers?.length === 0;

  return (
    <Page title="Quản Lý Cửa Hàng">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Quản Lý Danh Sách Cửa Hàng
          </Typography>
          {/* <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button> */}
        </Stack>
        {/* <Typography sx={{ color: 'red', marginBottom: '20px', fontSize: '20px' }}>{error1}</Typography> */}
        <Box sx={{ marginLeft: '30px' }}>
            <Box sx={{ display: 'flex', marginBottom: '15px', alignItems: 'center', height: '56px' }}>
              <Typography textAlign="center">Tên cửa hàng</Typography>
              <input
                style={{
                  width: '120px',
                  height: '25px',
                  marginLeft: '32px',
                  borderRadius: '25px',
                  padding: '5px',
                }}
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </Box>
          </Box>
        
        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listUser?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                        shopID,
                        shopName,
                        shopkeeperName,
                        address,
                        email,
                        phone,
                        registerDate,
                        banned,
                        adminDivision1,
                        adminDivision2,
                        adminDivision3,
                    } = row;

                    const isItemSelected = selected.indexOf(shopID) !== -1;

                    return (
                      <TableRow
                        hover
                        key={shopID}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} /> */}
                        </TableCell>
                        <TableCell align="left" onClick={() => {
                          setItemProp(row);
                          setOpen(true);
                        }}
                        >{shopID}</TableCell>
                        <TableCell align="left" onClick={() => {
                          setItemProp(row);
                          setOpen(true);
                        }}
                        >{shopName}</TableCell>
                        <TableCell align="left" onClick={() => {
                          setItemProp(row);
                          setOpen(true);
                        }}
                        >{shopkeeperName}</TableCell>
                        <TableCell align="left" onClick={() => {
                          setItemProp(row);
                          setOpen(true);
                        }}
                        >{adminDivision3}, {adminDivision2}, {adminDivision1}</TableCell>
                        <TableCell align="left" onClick={() => {
                          setItemProp(row);
                          setOpen(true);
                        }}
                        >{email}</TableCell>
                        <TableCell align="left" onClick={() => {
                          setItemProp(row);
                          setOpen(true);
                        }}
                        >{phone}</TableCell>
                        <TableCell align="left" onClick={() => {
                          setItemProp(row);
                          setOpen(true);
                        }}
                        >{registerDate}</TableCell>
                        <TableCell>
                          {/* {confirmation === '0' ? (
                            <FormControl style={{ marginTop: '10px' }}>
                              <Select
                                style={{ height: '30px' }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={confirmation}
                                onChange={(e) => handleChangeDeliveryStatus(e, shopOrderID)}
                              >
                                <MenuItem value={0}>Đang Chờ</MenuItem>
                                <MenuItem value={1}>Nhận Đơn</MenuItem>
                                <MenuItem value={2}>Từ Chối Đơn</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            <FormControl style={{ marginTop: '10px' }}>
                              <Select
                                style={{ height: '30px' }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={confirmation}
                                onChange={(e) => handleChangeDeliveryStatus(e, shopOrderID)}
                              >
                                <MenuItem value={1}>Nhận Đơn</MenuItem>
                                <MenuItem value={2}>Từ Chối Đơn</MenuItem>
                              </Select>
                            </FormControl>
                          )} */}
                          <Button
                            sx={{ marginTop: '20px' }}
                            variant={banned === false ? 'outlined' : 'contained'}
                            onClick={() => {
                              // handleClickStatus(confirmation, shopOrderID);
                              setInputVals({ banned ,  shopID });
                              setOpenConfirm(true);
                            }
                            }
                          >
                            {/* {confirmation === '0' ? 'Nhận Đơn' : 'Huỷ đơn'} */}
                            Cấm
                          </Button>
                        </TableCell>
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
            count={listUser?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      {/* <SimpleDialog open={open} itemProp={itemProp} onClose={() => setOpen(false)} /> */}
      <DialogApp
        content={error1}
        type={0}
        isOpen={openToast}
        severity={severity}
        callback={() => {
          setOpenToast(false);
        }}
      />
      <ConfirmDlg
        title="Thông Báo"
        open={openConfirm}
        setOpen={setOpenConfirm}
        onConfirm={handleOnConfirm}
      >
        {inputValues.banned === false &&  'Xác nhận cấm cửa hàng này? (không cho phép cửa hàng gửi đơn vận chuyển đến hệ thống nữa)'}
        {inputValues.banned === true &&  'Gỡ bỏ lệnh cấm đối với cửa hàng này? (Cho phép cửa hàng gửi đơn vận chuyển đến hệ thống)'}
      </ConfirmDlg>
    </Page>
  );
}
