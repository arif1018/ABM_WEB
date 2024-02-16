import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import partiesService from './purchaseDeliveryGRNService'


const initialState = {
    GRNParties: [],
    Items: [],
    DCNO:[],
    PDDONO:[],
    dataForDelete: [],
    MasterDataAfterSave: [],
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

export const getSuppliers = createAsyncThunk('PDsuppliers/get', async(thunkAPI)=>{
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

export const getDCNO = createAsyncThunk('DCNO/get', async(userid, thunkAPI)=>{
    try {
        return await partiesService.getDCNO(userid)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getPDDONO = createAsyncThunk('PDDONO/get', async(partyname, thunkAPI)=>{
    try {
        return await partiesService.getPDDONO(partyname)
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

export const deleteRecord = createAsyncThunk('deleteNewRecord/post', async(userData, thunkAPI)=>{
    console.log(userData)
    try {
        return await partiesService.deleteRecord(userData)
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
            state.GRNParties = []
            state.Items = []
            state.DCNO = []
            state.PDDONO = []
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
                state.GRNParties = action.payload
            })
            .addCase(getSuppliers.rejected, (state, action)=>{
                state.isLoadingParty = false
                state.isError = true
                state.message = action.payload
                state.GRNParties = []
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
            .addCase(getDCNO.pending, (state)=>{
                state.isLoadingDONO = true
            })
            .addCase(getDCNO.fulfilled, (state, action)=>{
                state.isLoadingDONO = false
                state.isSuccess = true
                state.DCNO = action.payload
            })
            .addCase(getDCNO.rejected, (state, action)=>{
                state.isLoadingDONO = false
                state.isError = true
                state.message = action.payload
                state.DCNO = []
            })
            .addCase(getPDDONO.pending, (state)=>{
                state.isLoadingDONO = true
            })
            .addCase(getPDDONO.fulfilled, (state, action)=>{
                state.isLoadingDONO = false
                state.isSuccess = true
                state.PDDONO = action.payload
            })
            .addCase(getPDDONO.rejected, (state, action)=>{
                state.isLoadingDONO = false
                state.isError = true
                state.message = action.payload
                state.PDDONO = []
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
            .addCase(deleteRecord.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(deleteRecord.fulfilled, (state, action)=>{
                state.isLoading = true
                state.isSuccess = true
                state.dataForDelete = action.payload
            })
            .addCase(deleteRecord.rejected, (state, action)=>{
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
                state.MasterDataAfterSave = action.payload
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