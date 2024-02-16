import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import partiesService from './stockAdjustmentService'


const initialState = {
    BarCodeDetail:[],
    dataForTable:[],
    MasterSavedData:[],
    isSuccessItemSave:false,
    isLoadingBarCodeDetail:false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

export const dataForBarCode = createAsyncThunk('SA_BDetail/get', async(PDRONO_UserID, thunkAPI)=>{
    try {
        return await partiesService.dataForBarCode(PDRONO_UserID)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const dataForDataTable = createAsyncThunk('stkAdj/get_DFT', async(UserID, thunkAPI)=>{
    try {
        return await partiesService.dataForDataTable(UserID)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const addNewRecord = createAsyncThunk('StkAdj/post', async(userData, thunkAPI)=>{
    try {
        return await partiesService.addNewRecord(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteRecord = createAsyncThunk('PA_D_R/post', async(userData, thunkAPI)=>{
    try {
        return await partiesService.deleteRecord(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const SaveMasterRecord = createAsyncThunk('PA_A_M_R/post', async(userData, thunkAPI)=>{
    try {
        return await partiesService.SaveMasterRecord(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const stockSlice = createSlice({
    name: 'physicalAudit',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isError = false
            state.isSuccess = false
            state.isSuccessItemSave = false
            state.isLoading = false
            state.message = ""
            state.MasterSavedData = []
            state.BarCodeDetail = []
            state.dataForTable =[]
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
            .addCase(dataForDataTable.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(dataForDataTable.fulfilled, (state, action)=>{
                state.isLoading = false
                state.dataForTable = action.payload
            })
            .addCase(dataForDataTable.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.dataForTable = []
            })
            .addCase(addNewRecord.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(addNewRecord.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccessItemSave = true
                state.tableData = action.payload
            })
            .addCase(addNewRecord.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.tableData = []
            })
            .addCase(deleteRecord.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(deleteRecord.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccessItemSave = true
                state.SaveData = action.payload
            })
            .addCase(deleteRecord.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.SaveData = []
            })
            .addCase(SaveMasterRecord.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(SaveMasterRecord.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.MasterSavedData = action.payload
            })
            .addCase(SaveMasterRecord.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.MasterSavedData = []
            })
        }
})

export const { reset } = stockSlice.actions

export default stockSlice.reducer