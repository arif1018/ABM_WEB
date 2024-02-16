import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import partiesService from './purchaseService'


const initialState = {
    Parties: [],
    Items: [],
    Units:[],
    DONO:[],
    Currency:[],
    dataForTable:[],
    isLoading:false,
    isLoadingParty: false,
    isLoadingItem: false,
    isLoadingUnit: false,
    isLoadingCurrency: false,
    isLoadingDONO: false,
    isError: false,
    isSuccess: false,
    message: ""
}

export const getSuppliers = createAsyncThunk('suppliers/get', async(thunkAPI)=>{
    try {
        return await partiesService.getSuppliers()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getItems = createAsyncThunk('items/get', async(thunkAPI)=>{
    try {
        return await partiesService.getItems()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getUnits = createAsyncThunk('units/get', async(thunkAPI)=>{
    try {
        return await partiesService.getUnits()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getCurrency = createAsyncThunk('currency/get', async(thunkAPI)=>{
    try {
        return await partiesService.getCurrency()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getDONO = createAsyncThunk('DONO/get', async(userid, thunkAPI)=>{
    try {
        return await partiesService.getDONO(userid)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const addNewRecord = createAsyncThunk('addNewRecord/post', async(userData, thunkAPI)=>{
    try {
        return await partiesService.addNewRecord(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const SaveMasterRecord = createAsyncThunk('addMasterRecord/post', async(userData, thunkAPI)=>{
    try {
        return await partiesService.SaveMasterRecord(userData)
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
            state.isLoadingParty = false
            state.isLoadingItem = false
            state.isLoadingUnit = false
            state.isLoadingCurrency = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
            state.Parties = []
            state.Items = []
            state.Units = []
            state.DONO = []
            state.Currency = []
        }

    },
    extraReducers:(builder)=>{
        builder
            .addCase(getSuppliers.pending, (state)=>{
                state.isLoadingParty = true
            })
            .addCase(getSuppliers.fulfilled, (state, action)=>{
                state.isLoadingParty = false
                state.isSuccess = true
                state.Parties = action.payload
            })
            .addCase(getSuppliers.rejected, (state, action)=>{
                state.isLoadingParty = false
                state.isError = true
                state.message = action.payload
                state.Parties = []
            })
            .addCase(getItems.pending, (state)=>{
                state.isLoadingItem = true
            })
            .addCase(getItems.fulfilled, (state, action)=>{
                state.isLoadingItem = false
                state.isSuccess = true
                state.Items = action.payload
            })
            .addCase(getItems.rejected, (state, action)=>{
                state.isLoadingItem = false
                state.isError = true
                state.message = action.payload
                state.Items = []
            })
            .addCase(getUnits.pending, (state)=>{
                state.isLoadingUnit = true
            })
            .addCase(getUnits.fulfilled, (state, action)=>{
                state.isLoadingUnit = false
                state.isSuccess = true
                state.Units = action.payload
            })
            .addCase(getUnits.rejected, (state, action)=>{
                state.isLoadingUnit = false
                state.isError = true
                state.message = action.payload
                state.Units = {}
            })
            .addCase(getDONO.pending, (state)=>{
                state.isLoadingDONO = true
            })
            .addCase(getDONO.fulfilled, (state, action)=>{
                state.isLoadingDONO = false
                state.isSuccess = true
                state.DONO = action.payload
            })
            .addCase(getDONO.rejected, (state, action)=>{
                state.isLoadingDONO = false
                state.isError = true
                state.message = action.payload
                state.DONO = []
            })
            .addCase(getCurrency.pending, (state)=>{
                state.isLoadingCurrency = true
            })
            .addCase(getCurrency.fulfilled, (state, action)=>{
                state.isLoadingCurrency = false
                state.isSuccess = true
                state.Currency = action.payload
            })
            .addCase(getCurrency.rejected, (state, action)=>{
                state.isLoadingCurrency = false
                state.isError = true
                state.message = action.payload
                state.Currency = []
            })
            .addCase(addNewRecord.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(addNewRecord.fulfilled, (state, action)=>{
                state.isLoading = true
                state.isSuccess = true
            })
            .addCase(addNewRecord.rejected, (state, action)=>{
                state.isLoading = true
                state.isError = true
                state.message = action.payload
            })
            .addCase(SaveMasterRecord.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(SaveMasterRecord.fulfilled, (state, action)=>{
                state.isLoading = true
                state.isSuccess = true
            })
            .addCase(SaveMasterRecord.rejected, (state, action)=>{
                state.isLoading = true
                state.isError = true
                state.message = action.payload
            })
        }
})

export const { reset } = stockSlice.actions

export default stockSlice.reducer