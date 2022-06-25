// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import BlessingCard from 'src/views/cards/BlessingCard'

import { ethers } from 'ethers'
import CryptoBlessing from 'src/artifacts/contracts/CryptoBlessing.sol/CryptoBlessing.json'
import { useWeb3React } from "@web3-react/core"
import {cryptoBlessingAdreess} from 'src/@core/components/wallet/address'

import { useEffect, useState } from "react"

const Blessings = () => {

    const { active, chainId } = useWeb3React()
    const [blessings, setBlessings] = useState([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchBlessings() {
        console.log('chainId', chainId)
        if (chainId != 'undefined' && typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(cryptoBlessingAdreess(chainId), CryptoBlessing.abi, provider)
            try {
                setBlessings(await contract.getAllBlessings())
            } catch (err) {
                setBlessings([])
                console.log("Error: ", err)
            }
        }    
    }

    useEffect(() => {
        fetchBlessings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                <Typography variant='h5'>Blessing Market</Typography>
            </Grid>
            {blessings?.map((blessing) => (
                <Grid key={blessing.image} item xs={12} sm={6} md={4}>
                    <BlessingCard blessing={blessing} />
                </Grid>
            ))}   
        </Grid>
    )
}

export default Blessings
