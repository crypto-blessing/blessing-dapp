// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import {BUSD_ICON, CBT_ICON} from 'src/@core/components/wallet/crypto-icons'


import { useEffect, useState } from "react"

import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core"
import BUSDContract from 'src/artifacts/contracts/TestBUSD.sol/BUSD.json'
import CBTContract from 'src/artifacts/contracts/CryptoBlessingToken.sol/CryptoBlessingToken.json'
import {BUSDContractAddress, CBTContractAddress} from 'src/@core/components/wallet/address'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      color: theme.palette.common.black,
      backgroundColor: '#ede3ff'
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }))
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
'&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
},

// hide last border
'&:last-of-type td, &:last-of-type th': {
    border: 0
}
}))

const createData = (name, calories, fat, carbs, protein) => {
return { name, calories, fat, carbs, protein }
}

const rows = [
createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
createData('Eclair', 262, 16.0, 24, 6.0),
createData('Cupcake', 305, 3.7, 67, 4.3),
createData('Gingerbread', 356, 16.0, 49, 3.9)
]

const itemData = [
{
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
    rows: 2,
    cols: 2,
    featured: true,
},
{
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
},
{
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
},
];
  


const Wallet = () => {

    const { active, chainId } = useWeb3React()

    const [BNBAmount, setBNBAmount] = useState(0)
    const [BUSDAmount, setBUSDAmount] = useState(0)
    const [CBTAmount, setCBAmount] = useState('')

    async function fetchERC20Amount() {
        console.log('chainId', chainId)
        if (active && chainId != 'undefined' && typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const busdContract = new ethers.Contract(BUSDContractAddress(chainId), BUSDContract.abi, provider.getSigner())
            const cbtContract = new ethers.Contract(CBTContractAddress(chainId), CBTContract.abi, provider.getSigner())
            provider.getSigner().getAddress().then(async (address) => {
                try {
                    setBNBAmount(ethers.utils.formatEther(await provider.getBalance(address)))
                    setBUSDAmount(ethers.utils.formatEther(await busdContract.balanceOf(address)))
                    setCBAmount(await cbtContract.balanceOf(address) + '')
                } catch (err) {
                    console.log("Error: ", err)
                }
            })
            
        }    
      }
    
      useEffect(() => {
        fetchERC20Amount()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [chainId])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                <Typography variant='h5'>My Assets</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardHeader title='ERC-20 Tokens' titleTypographyProps={{ variant: 'h6' }} />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label='customized table'>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Assets</StyledTableCell>
                                    <StyledTableCell align='right'>Balance</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow key='BNB'>
                                    <StyledTableCell component='th' scope='row'>
                                        <Chip variant="outlined" icon={<BUSD_ICON />} label="BNB" />
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>{BNBAmount}</StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow key='BUSD'>
                                    <StyledTableCell component='th' scope='row'>
                                        <Chip variant="outlined" icon={<BUSD_ICON />} label="BUSD" />
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>{BUSDAmount}</StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow key='CBT'>
                                    <StyledTableCell component='th' scope='row'>
                                        <Chip variant="outlined" icon={<CBT_ICON />} label="CBT" />
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>{CBTAmount}</StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant='caption'>You can buy BNB on <Link target='_blank' href='https://www.binance.com/en/buy-BNB'>Binance</Link></Typography>
                        <Typography variant='caption'>, or exchange BUSD on <Link target='_blank' href='https://pancakeswap.finance/swap?outputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'>PancakeSwap</Link></Typography>
                    </CardContent>
                </Card>
                
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardHeader title='ERC-721 Tokens' titleTypographyProps={{ variant: 'h6' }} />
                    <CardContent>
                    <ImageList sx={{ width: 550, height: 500 }}>
                    {itemData.map((item) => (
                        <ImageListItem key={item.img}>
                        <img
                            src={`${item.img}?w=248&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={item.title}
                            subtitle={item.author}
                            actionIcon={
                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                aria-label={`info about ${item.title}`}
                            >
                                <InfoIcon />
                            </IconButton>
                            }
                        />
                        </ImageListItem>
                    ))}
                    </ImageList>
                    </CardContent>
                    
                </Card>
            </Grid>
        </Grid>
    )
}

export default Wallet
