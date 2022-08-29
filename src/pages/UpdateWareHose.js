import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import SimpleDialog from './DetailOrderView';
import DateRangePicker from './chooseTimeRangePicker';
import {
  getWorkingTerritory,
  getRegion,
  updateUnMangagedWarehouseAPI,
  getMangagedWarehouseAPI,
} from '../services/index';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'warehouseID ', label: 'Mã nhà kho ', alignRight: false },
  { id: 'name ', label: 'tên nhà kho', alignRight: false },
  { id: 'address ', label: 'địa chỉ', alignRight: false },
  { id: 'shopAddress', label: 'Địa bàn quản lý', alignRight: false },
  { id: 'manageStatus ', label: 'Trạng thái quản lý', alignRight: false },
];
// const { shopOrderID, shopName, shopkeeperName, shopAddress, shopPhone, registerDate } = row;

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

export default function UpdateWareHose() {
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
  const [statusChoose, setStatusChoose] = useState(0);
  const [statusAllChoose, setStatusAllChoose] = useState(0);
  const [Addresses, setAddresses] = useState('');
  const [regions, setRegions] = useState([]);
  const staffID = localStorage.getItem('staffID');
  const [listProduct, setListProduct] = useState([]);
  const [regionsChoose, setRegionsChoose] = useState(0);
  const [open, setOpen] = useState(false);
  const [itemProp, setItemProp] = useState({});

  async function getWorkingTerritoryAPI(id) {
    const res = await getWorkingTerritory(id);
    if (res?.status === 200) {
      getRegionAPI(res?.data);
      setAddresses(res?.data);
    }
  }
  async function getRegionAPI(id) {
    const res = await getRegion(id?.territoryID);
    if (res?.status === 200) {
      setRegions(res?.data);
    }
  }
  const updateUnMangagedWarehouse = async () => {
    const body = listProduct.map((e) => ({
      warehouseID: e?.warehouseID,
      managerID: staffID,
      manageStatus: e?.manageStatus,
    }));

    const res = await updateUnMangagedWarehouseAPI(body);
    if (res?.status === 200) {
      console.log(res?.data);
    }
  };

  const getMangagedWarehouse = async (body) => {
    try {
      const res = await getMangagedWarehouseAPI(body);
      setListProduct(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getWorkingTerritoryAPI(staffID);
  // }, []);
  useEffect(() => {
    getMangagedWarehouse(staffID);
  }, [staffID]);

  const handleChangeStatus = (event, id) => {
    const temp = listProduct.filter((e) => e.warehouseID === id);
    const tempArr = listProduct.filter((e) => e.warehouseID !== id);
    let temp1 = [];

    temp[0].manageStatus = event;
    temp1 = temp;
    console.log(temp1[0]?.manageStatus);
    const temp2 = [...temp1, ...tempArr];
    temp2.sort((a, b) => a.warehouseID - b.warehouseID);
    setListProduct(temp2);
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

  // const handleChangeStatus = (event) => {
  //   // const temp1 =
  // }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listProduct.length) : 0;

  const filteredUsers = applySortFilter(listProduct, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Product">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cập Nhật Nhà Kho Quản Lý
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/dashboard/addWarehouse');
            }}
          >
            Thêm Nhà Kho Quản Lý
          </Button>
          <Button variant="contained" onClick={updateUnMangagedWarehouse}>
            Lưu
          </Button>
        </Stack>

        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listProduct.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { warehouseID, name, address, shopAddress, manageStatus } = row;

                    const isItemSelected = selected.indexOf(warehouseID) !== -1;

                    return (
                      <TableRow
                        hover
                        key={warehouseID}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        // onClick={() => {
                        //   setItemProp(row);
                        //   setOpen(true);
                        // }}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} /> */}
                        </TableCell>
                        {/* const { warehouseID, name, address, shopAddress, manageStatus } = row; */}

                        <TableCell align="left">{warehouseID}</TableCell>
                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="left">{address}</TableCell>
                        <TableCell align="left">
                          <Button onClick={() => navigate('/dashboard/territory')}>Xem</Button>
                        </TableCell>
                        {/* <TableCell align="left">{manageStatus}</TableCell> */}

                        <FormControl style={{ marginTop: '10px' }}>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            style={{ height: '30px' }}
                            value={manageStatus}
                            onChange={(e) => handleChangeStatus(e?.target?.value, warehouseID)}
                          >
                            <MenuItem value={0}>Chưa xác nhận</MenuItem>
                            <MenuItem value={1}>Đã xác nhận</MenuItem>
                          </Select>
                        </FormControl>
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
      <SimpleDialog open={open} itemProp={itemProp} onClose={() => setOpen(false)} />
    </Page>
  );
}
