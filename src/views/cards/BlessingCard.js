// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

// ** Icons Imports
import {BUSD_ICON} from 'src/@core/components/wallet/crypto-icons'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { getBlessingTitle, getBlessingDesc } from 'src/@core/utils/blessing'

import {simpleShow, cryptoBlessingAdreess, BUSDContractAddress} from 'src/@core/components/wallet/address'


import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core"
import CryptoBlessing from 'src/artifacts/contracts/CryptoBlessing.sol/CryptoBlessing.json'
import BUSDContract from 'src/artifacts/contracts/TestBUSD.sol/BUSD.json'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
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

const BlessingCard = (props) => {

  const { active, chainId } = useWeb3React()

  const [open, setOpen] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [claimQuantity, setClaimQuantity] = useState(0);
  const [blessingCaption, setBlessingCaption] = useState('');
  const [claimType, setClaimType] = useState(-1);
  const handleOpen = () => setOpen(true);
  const [alertMsg, setAlertMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccessOpen, setSendSuccessOpen] = useState(false);
  const [blessingKeypairAddress, setBlessingKeypairAddress] = useState('');

  const handleClose = () => {
    setOpen(false)
    setBlessingCaption('')
    setTokenAmount(0)
    setClaimQuantity(0)
    setClaimType(-1)
  }

  const handleTokenAmountChange = (event) => {
    setTokenAmount(event.target.value);
    handleBlessingCaption(event.target.value, claimQuantity, claimType)
  }

  const handleClaimQuantityChange = (event) => {
    setClaimQuantity(event.target.value);
    handleBlessingCaption(tokenAmount, event.target.value, claimType)
  }

  const handleClaimTypeChange = (event) => {
    let localClaimType = -1
    switch (event.target.value) {
      case 'AVERAGE':
        localClaimType = 0
        break;
      case 'RANDOM':
        localClaimType = 1
        break;
    }
    console.log("localClaimType", localClaimType)
    setClaimType(localClaimType)
    handleBlessingCaption(tokenAmount, claimQuantity, localClaimType)
  }

  const handleBlessingCaption = (tokenAmount, claimQuantity, claimType) => {
    let payCaption = '', claimCaption = '';
    console.log(tokenAmount, claimQuantity, claimType)
    console.log('ethers.utils.formatEther(props.blessing.price', ethers.utils.formatEther(props.blessing.price))
    if (tokenAmount > 0 && claimQuantity > 0) {
      let totalPay = (claimQuantity * ethers.utils.formatEther(props.blessing.price)) + parseFloat(tokenAmount)
      payCaption = `You will pay ${totalPay} BUSD. `
    } else {
      payCaption = ''
    }
    if (payCaption !== '') {
      if (claimType > -1) {
        if (claimType === 0) {
          claimCaption = `Your friends will claim ${(tokenAmount / claimQuantity).toFixed(2)}(tax in) BUSD and one more NFT. `
        } else if (claimType === 1) {
          claimCaption = `Your friends will claim a random amount and one more NFT.`
        }
      } else {
        claimCaption = ''
      }
    }
    setBlessingCaption(payCaption + claimCaption)
  }

  async function submitSendBlessing() {
    if (tokenAmount <= 0 || tokenAmount > ethers.utils.formatEther(busdAmount)) {
      setAlertMsg('You have insufficient BUSD balance.')
      setAlertOpen(true);

      return
    }
    if (claimQuantity <= 0 || claimQuantity > 1000) {
      setAlertMsg('You only have up to 1,000 friends to collect your BUSD')
      setAlertOpen(true);

      return
    }
    if (claimType === -1) {
      setAlertMsg('Pls choose the way your friend will claim your BUSD')
      setAlertOpen(true);

      return
    }
    setSending(true)

    // start to send blessing
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const cbContract = new ethers.Contract(cryptoBlessingAdreess(chainId), CryptoBlessing.abi, provider.getSigner())
    const blessingKeypair = ethers.Wallet.createRandom();
    const busdContract = new ethers.Contract(BUSDContractAddress(chainId), BUSDContract.abi, provider.getSigner())
    try {
      await busdContract.approve(cryptoBlessingAdreess(chainId), BigInt((claimQuantity * ethers.utils.formatEther(props.blessing.price) + parseFloat(tokenAmount)) * 10 ** 18));
      
      const sendBlessingTx = await cbContract.sendBlessing(
        props.blessing.image, blessingKeypair.address, 
        BigInt(tokenAmount * 10 ** 18), 
        claimQuantity,
        claimType
      )
      await sendBlessingTx.wait();
      setSending(false)
      setBlessingKeypairAddress(blessingKeypair.address)
      localStorage.setItem('my_blessing_claim_key_' + blessingKeypair.address, blessingKeypair.privateKey)
      setOpen(false)
      setSendSuccessOpen(true)
      fetchBUSDAmount()
    } catch (e) {
      setAlertMsg('Something went wrong. Please contact admin in telegram.')
      setAlertOpen(true);
      setSending(false)
    }
    
  }

  const copyClaimLink = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getSigner().getAddress().then(async (address) => {
      const privateKey = localStorage.getItem('my_blessing_claim_key_' + blessingKeypairAddress)
      navigator.clipboard.writeText(`🙏CryptoBlessing🙏 Claim your BUSD & NFT here: https://cryptoblessing.app/claim/${blessingKeypairAddress}/${privateKey} which sended by ${simpleShow(address)}. May god bless you! 🙏`)
    })
  }

  const handleSendSuccessClose = () => {
    setSendSuccessOpen(false)
  }

  const [alertOpen, setAlertOpen] = useState(false);

  const handleAlertClose = () => {
    setAlertMsg('')
    setAlertOpen(false)
  }

  const [busdAmount, setBusdAmount] = useState(0)

  async function fetchBUSDAmount() {
    console.log('chainId', chainId)
    if (active && chainId != 'undefined' && typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const busdContract = new ethers.Contract(BUSDContractAddress(chainId), BUSDContract.abi, provider.getSigner())
        provider.getSigner().getAddress().then(async (address) => {
            try {
                setBusdAmount(await busdContract.balanceOf(address))
            } catch (err) {
                console.log("Error: ", err)
            }
        })
        
    }    
  }

  useEffect(() => {
    fetchBUSDAmount()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

  return (
    <Card>
      <CardMedia sx={{ height: '22rem' }} image={props.blessing.image} />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          {getBlessingTitle(props.blessing.description)}
        </Typography>
        <Typography variant='body2'>
          {getBlessingDesc(props.blessing.description, true)}
        </Typography>
      </CardContent>
      {active ?
        <Button onClick={handleOpen} variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          Send Blessing
        </Button>
      :
        <Button disabled variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          Connect Wallet
        </Button>
      }
      

      <CardContent>
        <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant='h6'>{simpleShow(props.blessing.owner)}</Typography>
              <Typography variant='caption'>Designer</Typography>
            </Box>
            <Button startIcon={<AttachMoneyIcon />} variant='outlined' color='error'>{ethers.utils.formatEther(props.blessing.price).toString()} BUSD</Button>
          </Box>
      </CardContent>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card>
            <CardHeader title='Send Blessing' titleTypographyProps={{ variant: 'h6' }} />
            <Grid container spacing={6}>
              <StyledGrid item md={5} xs={12}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img width={137} height={137} alt='Apple iPhone 11 Pro' src={props.blessing.image} />
                </CardContent>
              </StyledGrid>
              <Grid
                item
                xs={12}
                md={7}
                sx={{
                  paddingTop: ['0 !important', '0 !important', '1rem !important'],
                  paddingLeft: ['1rem !important', '1rem !important', '0 !important']
                }}
              >
                <CardContent>
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                  {getBlessingTitle(props.blessing.description)}
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 3.5 }}>
                  {getBlessingDesc(props.blessing.description)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
                    Designer:{' '}
                    <Box component='span' sx={{ fontWeight: 'bold' }}>
                      {simpleShow(props.blessing.owner)}
                    </Box>
                  </Typography>
                </CardContent>
                <CardActions className='card-action-dense'>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Button startIcon={<AttachMoneyIcon />} variant='outlined' color='error'>{ethers.utils.formatEther(props.blessing.price).toString()} BUSD</Button>
                  </Box>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
          <Card>
            <CardContent>
              <form onSubmit={e => e.preventDefault()}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField
                      onChange={handleTokenAmountChange}
                      fullWidth
                      label={'How much BUSD do you want to send?(wallet: ' + ethers.utils.formatEther(busdAmount) + ' BUSD)'}
                      placeholder='10'
                      type='number'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <BUSD_ICON />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onChange={handleClaimQuantityChange}
                      fullWidth
                      label={'How many friends are expected to claim?'}
                      placeholder='2'
                      type='number'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <AccountCircleIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">The way they claim your BUSD?</FormLabel>
                      <RadioGroup
                        onChange={handleClaimTypeChange}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel value="AVERAGE" control={<Radio />} label="AVERAGE"/>
                        <FormControlLabel value="RANDOM" control={<Radio />} label="RANDOM" />
                      </RadioGroup>
                    </FormControl>
                    
                  </Grid>
                </Grid>
              </form>
              <Typography variant="caption" display="block" gutterBottom color='error'>
                {blessingCaption}
              </Typography>
            </CardContent>
            <Divider sx={{ margin: 0 }} />
            <CardActions
            sx={{
              gap: 5,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            >
              <Button onClick={handleClose} size='large' color='secondary' variant='outlined'>
                Cancel
              </Button>
              <Button onClick={submitSendBlessing} disabled={sending} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                Send Blessing
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>

      <Modal
        open={sendSuccessOpen}
        onClose={handleSendSuccessClose}
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
                You have already sended this blessing successfully. Pls copy the claim link and share it with your friends.
              </Typography>
              <Typography variant='caption' color='error'>
                FYI, only use this claim link can claim your blessing!
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
                <Button onClick={handleSendSuccessClose} size='large' color='secondary' variant='outlined'>
                  Cancel
                </Button>
                <Button onClick={copyClaimLink} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  Copy Claim Link
                </Button>
              </CardActions>
          </Card>
        </Box>
      </Modal>

      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alertOpen} 
        onClose={handleAlertClose}
        autoHideDuration={4000}>
        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%', bgcolor: 'white' }}>
          {alertMsg}
          <Link target='_blank' href="https://t.me/crypto_blessing_eng" underline="always">Find admin in telegram</Link>
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default BlessingCard
