// ** React Imports
import { useEffect, useState } from "react"

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import {decode} from 'src/@core/utils/cypher'

import { ethers } from 'ethers'
import CryptoBlessing from 'src/artifacts/contracts/CryptoBlessing.sol/CryptoBlessing.json'
import { useWeb3React } from "@web3-react/core"
import {cryptoBlessingAdreess, BUSDContractAddress} from 'src/@core/components/wallet/address'


// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '40rem' }
}))

const ClaimPage = () => {

  // ** Hook
  const router = useRouter()

  let params = router.query
  console.log('params', params.param?.length)
  let sender = '', blessingID = '', claimKey = '';
  if (params.param?.length === 3) {
    sender = decode(params.param[0])
    blessingID = decode(params.param[1])
    claimKey = decode(params.param[2])
  }

  const { active, chainId } = useWeb3React()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function featchAllInfoOfBlessing() {
    console.log('chainId', chainId)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const cbContract = new ethers.Contract(cryptoBlessingAdreess(chainId), CryptoBlessing.abi, provider)
    try {
      console.log(await cbContract.getAllInfoOfBlessing(sender, blessingID))
    } catch (err) {
      console.log("Error: ", err)
      const queryWallet = ethers.Wallet.createRandom();
      // const provider = new PrivateKeyProvider(queryWallet.privateKey, 'http://localhost:8545')
      const cbContract = new ethers.Contract(cryptoBlessingAdreess(chainId), CryptoBlessing.abi, provider)
      console.log(await cbContract.getAllInfoOfBlessing(sender, blessingID))
    }
  }

  useEffect(() => {
    featchAllInfoOfBlessing()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={2}>
      </Grid>
      <Grid item xs={12} sm={6} md={8}>
        <Card sx={{ zIndex: 1 }}>
          <CardContent>

            <Divider sx={{ my: 5 }}></Divider>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
      </Grid>
    </Grid>
  )
}


export default ClaimPage
