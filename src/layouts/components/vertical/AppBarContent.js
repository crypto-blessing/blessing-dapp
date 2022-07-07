// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


import {injected} from 'src/@core/components/wallet/connector'
import {simpleShow, chainName} from 'src/@core/components/wallet/address'
import { useWeb3React } from "@web3-react/core"

import { useEffect, useState } from "react"

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'
import Magnify from 'mdi-material-ui/Magnify'

import LogoutIcon from '@mui/icons-material/Logout';

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'



const AppBarContent = props => {

  const { active, account, library, connector, activate, deactivate, chainId } = useWeb3React()

  async function connect() {
    try {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch((e) => {
            setOpen(true);
          });
        } else {
          console.log("not authorized")
        }
      });
      localStorage.setItem('isWalletConnected', true)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      await deactivate()
      localStorage.setItem('isWalletConnected', false)
    } catch (ex) {
      console.log(ex)
    }
  }

  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))
  

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      } else {
        console.log("not connected")
      }
    }
    connectWalletOnPageLoad()
  }, [activate, account, props])

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  }

  return (

    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        {/* <TextField
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            )
          }}
        /> */}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>

        {active ? 
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button variant="outlined">{chainName(chainId)}</Button>
          <Button>{simpleShow(account)}</Button>
          <IconButton onClick={disconnect} color="primary" aria-label="add to shopping cart">
            <LogoutIcon />
          </IconButton>
        </ButtonGroup>  
        : 
        <Button onClick={connect} size='large' variant='outlined'>
          Connect Wallet
        </Button>
        }
        <Box sx={{ ml: 2 }} />
        <ModeToggler settings={settings} saveSettings={saveSettings} />
      </Box>
      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open} 
        onClose={handleClose}
        autoHideDuration={4000}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%', bgcolor: 'white' }}>
          Only support BSC network!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AppBarContent
