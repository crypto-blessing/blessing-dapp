// ** React Imports
import { useEffect, useState } from "react"

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import {BUSD_ICON, CBT_ICON} from 'src/@core/components/wallet/crypto-icons'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import CardMedia from '@mui/material/CardMedia'
import CircularProgress from '@mui/material/CircularProgress';

import { green } from '@mui/material/colors';

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import {decode, toEthSignedMessageHash} from 'src/@core/utils/cypher'

import { ethers, utils } from 'ethers'
import CryptoBlessing from 'src/artifacts/contracts/CryptoBlessing.sol/CryptoBlessing.json'
import { useWeb3React } from "@web3-react/core"
import { getBlessingTitle, getBlessingDesc, transClaimListFromWalletClaims } from 'src/@core/utils/blessing'
import {simpleShow, cryptoBlessingAdreess} from 'src/@core/components/wallet/address'
import {toLocaleDateFromBigInt} from 'src/@core/utils/date'


import {encode} from 'src/@core/utils/cypher'

const Web3 = require('web3');

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '40rem' }
}))

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

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

const ClaimPage = () => {
  const [sender, setSender] = useState('')
  const [blessingID, setBlessingID] = useState('')
  const [claimKey, setClaimKey] = useState('')
  const router = useRouter()

  // ** Hook
  useEffect (() => {
    let params = router.query
    console.log('params', params.param?.length)
    if (params.param?.length === 2 || params.param?.length === 3) {
      setSender(decode(params.param[0]))
      setBlessingID(decode(params.param[1]))
      if (params.param?.length === 3) {
        setClaimKey(decode(params.param[2]))
      }
      if (localStorage.getItem('my_claimed_' + decode(params.param[1])) === '1' || localStorage.getItem('my_blessing_claim_key_' + decode(params.param[1])) != undefined) {
        console.log('already claimed')
        setAlreadyClaimed(true)
      }
    }
   
  }, [router.query])
  

  const [blessing, setBlessing] = useState({})
  const [blessingSended, setBlessingSended] = useState({})
  const [claimList, setClaimList] = useState([])

  const [alertMsg, setAlertMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const [claiming, setClaiming] = useState(false);
  const [claimSuccessOpen, setClaimSuccessOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [revoking, setRevoking] = useState(false)

  const [claimResult, setClaimResult] = useState({})

  const [alreadyClaimed, setAlreadyClaimed] = useState(false)

  const handleClaimSuccessClose = () => {
    setClaimSuccessOpen(false)
  }

  const handleAlertOpen = (msg) => {
    setAlertMsg(msg)
    setAlertOpen(true)
  }

  const handleAlertClose = () => {
    setAlertMsg('')
    setAlertOpen(false)
  }

  const { active, account, chainId, library } = useWeb3React()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function featchAllInfoOfBlessing(provider) {
    console.log('featchAllInfoOfBlessing', sender)
    if (sender != '' && active && chainId != 'undefined' && typeof window.ethereum !== 'undefined') {
      const cbContract = new ethers.Contract(cryptoBlessingAdreess(chainId), CryptoBlessing.abi, provider.getSigner())
      try {
        console.log('start', sender)
        const result = await cbContract.getAllInfoOfBlessing(sender, blessingID)
        console.log('result', result)
        setBlessing(result[0])
        setBlessingSended(result[1])
        setClaimList(transClaimListFromWalletClaims(result[2]))
        setLoading(false);
      } catch (err) {
        console.log("Error: ", err)
        window.location.replace("/pages/404")
      }
    }
  }

  const revokeBlessing = async () => {
    setRevoking(true)

    // start to claim blessing
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const cbContract = new ethers.Contract(cryptoBlessingAdreess(chainId), CryptoBlessing.abi, provider.getSigner())

    try {
      await cbContract.revokeBlessing(
        blessingSended.blessingID
      )
      setRevoking(false)
    } catch (e) {
      console.log(e)
      setRevoking(false)
    }

  }

  const copyClaimLink = () => {
    const privateKey = localStorage.getItem('my_blessing_claim_key_' + blessingSended.blessingID)

    navigator.clipboard.writeText(`🙏CryptoBlessing🙏 Claim your BUSD & NFT here: https://cryptoblessing.app/claim/${encode(sender)}/${encode(blessingSended.blessingID)}/${encode(privateKey)} which sended by ${simpleShow(sender)}. May god bless you! 🙏`)
    handleAlertOpen('Claim Link Copied!')
  }

  const claimBlessing = async () => {
    setClaiming(true)

    // start to claim blessing
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const cbContract = new ethers.Contract(cryptoBlessingAdreess(chainId), CryptoBlessing.abi, provider.getSigner())
    
    try {
      // const signature = await blessingKeypair.signMessage(MESSAGE)
      const web3 = new Web3(window.ethereum);
      const MESSAGE = web3.utils.sha3('CryptoBlessing');
      const signature = await web3.eth.accounts.sign(MESSAGE, claimKey);

      const claimResult = await cbContract.claimBlessing(
        sender, 
        blessingSended.blessingID, 
        toEthSignedMessageHash(web3, MESSAGE),
        signature.signature
      )
      console.log('claimResult', claimResult.value.toString())
      setClaimResult(claimResult)
      setClaiming(false)
      localStorage.setItem('my_claimed_' + blessingSended.blessingID, 1)
      setClaimSuccessOpen(true)
      setAlreadyClaimed(true)
      setLoading(true);
    } catch (e) {
      console.log(e)
      setAlertMsg('Something went wrong. Please contact admin in telegram.')
      setAlertOpen(true);
      setClaiming(false)
    }
  }

  const toWalletHandle = () => {
    window.location.replace("/wallet")
  }

  useEffect(() => {
    console.log('start featchAllInfoOfBlessing')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setBlessing({
      image: "/images/logo.png",
      description: "Crypto Blessing#Blessing is the most universal human expression of emotion, and we are NFTizing it.",
    })
    setBlessingSended({
      tokenAmount: BigInt(0.1 * 10 ** 18),
      claimQuantity: 0,
      sendTimestamp: BigInt(1656544299),
    })
    setClaimList([])
    featchAllInfoOfBlessing(provider)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sender, chainId, account])

  useEffect(() => {
    if (chainId && sender && blessingID) {
      const web3 = new Web3(window.ethereum)
      const cbContract = new web3.eth.Contract(CryptoBlessing.abi, cryptoBlessingAdreess(chainId))
      cbContract.events.claimerClaimComplete({
        filter: {
          sender: sender,
          blessingID: blessingID,
        }
      }).on('data', event => {
        console.log('event', event)
        if (event.returnValues.sender == sender && event.returnValues.blessingID == blessingID) {
          featchAllInfoOfBlessing(new ethers.providers.Web3Provider(window.ethereum))
        }
      })
      cbContract.events.senderRevokeComplete({
        filter: {
          sender: sender,
          blessingID: blessingID,
        }
      }).on('data', event => {
        console.log('event', event)
        if (event.returnValues.sender == sender && event.returnValues.blessingID == blessingID) {
          featchAllInfoOfBlessing(new ethers.providers.Web3Provider(window.ethereum))
        }
      })
    }
  }, [chainId, blessingID, sender, featchAllInfoOfBlessing])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={2}>
      </Grid>
      <Grid item xs={12} sm={6} md={8}>
        <Card sx={{ zIndex: 1 }}>
          <CardContent
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
            }}
          >
            <Avatar
              sx={{ width: 150, height: 150, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
            >
              <img width={150} height={150} alt='CryptoBlessing' src={blessing.image} />
            </Avatar>
            <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
            {getBlessingTitle(blessing.description)}
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 6 }}>
            {getBlessingDesc(blessing.description)}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip variant="outlined" color="warning" label={(blessingSended && blessingSended.tokenAmount ? ethers.utils.formatEther(blessingSended.tokenAmount) : 0) + ' BUSD'} icon={<BUSD_ICON />} />
              <Chip variant="outlined" color="primary" label={claimList.length + '/' + (blessingSended?.claimQuantity?.toString()) + ' Blessings'} icon={<AccountCircleIcon />} />
            </Stack>
          </CardContent>
          <Divider sx={{ my: 3 }}>sended at {blessingSended.sendTimestamp ? toLocaleDateFromBigInt(blessingSended.sendTimestamp) : '1970'}  by {sender ? simpleShow(sender) : 'CryptoBlessing'}</Divider>
          <CardContent>
            {claimList.length > 0 ?
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label='customized table'>
                  <TableHead>
                      <TableRow>
                          <StyledTableCell>Claimer</StyledTableCell>
                          <StyledTableCell>Time</StyledTableCell>
                          <StyledTableCell>Amount</StyledTableCell>
                          <StyledTableCell>CBT Reward</StyledTableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                  {claimList.map(row => (
                    <StyledTableRow key={row.claimer}>
                      <StyledTableCell component='th' scope='row'>
                        {row.claimer}
                      </StyledTableCell>
                      <StyledTableCell>{row.time}</StyledTableCell>
                      <StyledTableCell align='right'>
                        <Stack direction="row" spacing={1}>
                          <Chip variant="outlined" color="warning" label={row.amount} icon={<BUSD_ICON />} />
                          <Chip
                            avatar={<Avatar alt="CryptoBlessing" src={blessing.image} />}
                            label="1"
                            variant="outlined"
                          />
                        </Stack>  
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        <Tooltip disableFocusListener disableTouchListener title="The CBT tokens will reward to the sender of this blessing.">
                          <Chip variant="outlined" color="primary" label={row.CBTokenAwardToSenderAmount} icon={<CBT_ICON />} />
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  </TableBody>
              </Table>
            </TableContainer>
            :
            <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography  variant="overline" display="block" gutterBottom>
                There is no one claimed yet!
              </Typography>
            </Box>
            }

            {
              claimList.length > 0 && claimList.length == blessingSended.claimQuantity ?
              <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Typography  variant="overline" display="block" gutterBottom>
                  All the blessings have already been claimed!
                </Typography>
              </Box>
            : ''
            }
            
          </CardContent>

          <CardActions
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
            >
            { !active ?
            <Button disabled variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              Connect Wallet First
            </Button>
            :
            ''
            }
            { active && sender === account && !blessingSended.revoked ?
              <Stack direction="row" spacing={1}>
                <Tooltip title="You can only revoke the amount you sended and need there is no one claimed it yet.">
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <Button disabled={claimList.length > 0 || revoking} onClick={revokeBlessing} size='large' color='error' variant='outlined'>
                  Revoke
                </Button>
                
                <Button disabled={claimList.length > 0 && claimList.length == blessingSended.claimQuantity} onClick={copyClaimLink} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  Copy Claim Link
                </Button>
              </Stack>
            :
            ''
            }

            { active && sender === account && blessingSended.revoked ?
              <Stack direction="row" spacing={1}>
                <Tooltip title="You can only revoke the amount you sended and need there is no one claimed it yet.">
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <Button disabled size='large' color='error' variant='outlined'>
                  Revoked
                </Button>
                
                <Button disabled onClick={copyClaimLink} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  Copy Claim Link
                </Button>
              </Stack>
            :
            ''
            }



            { active && sender !== account ?
            <Stack direction="row" spacing={1}>
              <Box sx={{ m: 1, position: 'relative' }}>
                <Button disabled={claiming || claimKey == '' || alreadyClaimed} onClick={claimBlessing} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  {loading ? 'Waiting for claim transaction...' : 'Claim Blessing'}
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: green[500],
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
             
            </Stack>
              :
              ''
            }
            
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
      </Grid>

      <Modal
        open={claimSuccessOpen}
        onClose={handleClaimSuccessClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card>
            <CardMedia sx={{ height: '14.5625rem' }} image='/images/blessings/congrats.webp' />
            <CardContent>
              <Typography variant='h6' sx={{ marginBottom: 2 }}>
                Congratulations!
              </Typography>
              <Typography variant='body2'>
                Congrats!!! You have already claimed this blessing successfully. 
              </Typography>
              <Typography variant='caption' color='error'>
                You just claimed your BUSD and one more NFT, You can check out in your wallet.
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                gap: 5,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              >
              <Button onClick={handleClaimSuccessClose} size='large' color='secondary' variant='outlined'>
                Cancel
              </Button>
              <Button onClick={ toWalletHandle } size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                To My Wallet
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>

      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alertOpen} 
        onClose={handleAlertClose}
        autoHideDuration={3000}>
        <Alert onClose={handleAlertClose} severity="info" sx={{ width: '100%', bgcolor: 'white' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </Grid>
  )
}


export default ClaimPage
