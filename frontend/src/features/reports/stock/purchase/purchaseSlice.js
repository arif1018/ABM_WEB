import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import purchaseService from './purchaseService'


const initialState = {
    PM: [],
    BarCodeData: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

export const getMasterData = createAsyncThunk('PM/get', async(userData, thunkAPI)=>{
    try {
        return await purchaseService.getMasterData(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateEditStatus = createAsyncThunk('UES/get', async(userData, thunkAPI)=>{
    try {
        return await purchaseService.updateEditStatus(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const BarCode_GRN = createAsyncThunk('GRNSticker/get', async(userData, thunkAPI)=>{
    try {
        return await purchaseService.BarCode_GRN(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const stockSlice = createSlice({
    name: 'PurchaseMaster',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
            state.stock = []
            state.ItemList = []
        }

    },
    extraReducers:(builder)=>{
        builder
            .addCase(getMasterData.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getMasterData.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.PM = action.payload
            })
            .addCase(getMasterData.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.PM = []
            })
            .addCase(updateEditStatus.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(updateEditStatus.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(updateEditStatus.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(BarCode_GRN.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(BarCode_GRN.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.BarCodeData = action.payload
            })
            .addCase(BarCode_GRN.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
        }
})

export const { reset } = stockSlice.actions

export default stockSlice.reducer