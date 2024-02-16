import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import reusableService from './reusableService'


const initialState = {
    BarCodeDetail:[],
    Items: [],
    Parties: [],
    Currency: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

export const dataForBarCode = createAsyncThunk('BarCodeDetail/get', async(PDRONO_UserID, thunkAPI)=>{
    try {
        return await reusableService.dataForBarCode(PDRONO_UserID)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getItems = createAsyncThunk('RUitems/get', async(thunkAPI)=>{
    try {
        return await reusableService.getItems()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getParties = createAsyncThunk('RUparties/get', async(thunkAPI)=>{
    try {
        return await reusableService.getParties()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getCurrency = createAsyncThunk('RUcurrency/get', async(thunkAPI)=>{
    try {
        return await reusableService.getCurrency()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const stockSlice = createSlice({
    name: 'stockAll',
    initialState,
    reducers:{
        reset:(state)=>{
            state.BarCodeDetail = []
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
        }

    },
    extraReducers:(builder)=>{
        builder
            .addCase(dataForBarCode.pending, (state)=>{
                state.isLoadingBarCodeDetail = true
            })
            .addCase(dataForBarCode.fulfilled, (state, action)=>{
                state.isLoadingBarCodeDetail = false
                state.isSuccess = true
                state.BarCodeDetail = action.payload
            })
            .addCase(dataForBarCode.rejected, (state, action)=>{
                state.isLoadingBarCodeDetail = false
                state.isError = true
                state.message = action.payload
                state.BarCodeDetail = []
            })
            .addCase(getItems.pending, (state)=>{
                state.isLoadingBarCodeDetail = true
            })
            .addCase(getItems.fulfilled, (state, action)=>{
                state.isLoadingBarCodeDetail = false
                state.isSuccess = true
                state.Items = action.payload
            })
            .addCase(getItems.rejected, (state, action)=>{
                state.isLoadingBarCodeDetail = false
                state.isError = true
                state.message = action.payload
                state.Items = []
            })
            .addCase(getParties.pending, (state)=>{
                state.isLoadingBarCodeDetail = true
            })
            .addCase(getParties.fulfilled, (state, action)=>{
                state.isLoadingBarCodeDetail = false
                state.isSuccess = true
                state.Parties = action.payload
            })
            .addCase(getParties.rejected, (state, action)=>{
                state.isLoadingBarCodeDetail = false
                state.isError = true
                state.message = action.payload
                state.Parties = []
            })
            .addCase(getCurrency.pending, (state)=>{
                state.isLoadingBarCodeDetail = true
            })
            .addCase(getCurrency.fulfilled, (state, action)=>{
                state.isLoadingBarCodeDetail = false
                state.isSuccess = true
                state.Currency = action.payload
            })
            .addCase(getCurrency.rejected, (state, action)=>{
                state.isLoadingBarCodeDetail = false
                state.isError = true
                state.message = action.payload
                state.Currency = []
            })
        }
})

export const { reset } = stockSlice.actions

export default stockSlice.reducer