// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

import { ethers } from 'ethers'
import { useWeb3React } from "@web3-react/core"
import CryptoBlessing from 'src/artifacts/contracts/CryptoBlessing.sol/CryptoBlessing.json'



import {cryptoBlessingAdreess} from 'src/@core/components/wallet/address'
import {transBlesingsFromWalletBlessings} from 'src/@core/utils/blessing.js'

import { useEffect, useState } from "react"


const columns = [
    { id: 'blessing', label: 'Blessing', minWidth: 100, type: 'image' },
    { id: 'time', label: 'Time(UTC)', minWidth: 100 },
    { id: 'amount', label: 'BUSD Amount', minWidth: 100 },
    { id: 'quantity', label: 'Claime Quantity', minWidth: 100 },
    { id: 'type', label: 'Claim Way', minWidth: 100 },
    { id: 'progress', label: 'Claim Progress', minWidth: 100 }
]

const BlessingSended = () => {

    // ** States
    const [page, setPage] = useState(0)
    const [blessings, setBlessings] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }


    const { active, chainId } = useWeb3React()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchMySendedBlessings() {
        console.log('chainId', chainId)
        if (active && chainId != 'undefined' && typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const cbContract = new ethers.Contract(cryptoBlessingAdreess(chainId), CryptoBlessing.abi, provider.getSigner())
            try {
                const blessings = await cbContract.getMySendedBlessings()
                setBlessings(transBlesingsFromWalletBlessings(blessings))
                console.log('blessings', blessings)
            } catch (err) {
                console.log("Error: ", err)
            }
            
        }    
    }

    useEffect(() => {
        fetchMySendedBlessings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                Blessing Sended History
                </Typography>
                <Typography variant='body2'>Do you need help? You can join our telegram group: 
                    <Link target='_blank' href="https://t.me/crypto_blessing_eng" underline="always">Find admin in telegram</Link>
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 800 }}>
                    <Table stickyHeader aria-label='sticky table'>
                    <TableHead>
                        <TableRow>
                        {columns.map(column => (
                            <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {blessings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                        return (
                            <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                            {columns.map(column => {
                                const value = row[column.id]

                                return (
                                <TableCell key={column.id} align={column.align}>
                                    {column.type === 'image' ? 
                                    <img width={80} height={80} alt='CryptoBlessing' src={value} />
                                    : 
                                    column.format && typeof value === 'number' ? column.format(value) : value}
                                </TableCell>
                                )
                            })}
                            </TableRow>
                        )
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component='div'
                    count={blessings.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default BlessingSended
