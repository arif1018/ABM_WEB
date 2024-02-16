import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import partiesService from './salesDeliveryGDNService'


const initialState = {
    DCNO:[],
    SDDONO:[],
    SDDODetail:[],
    BarCodeDetail:[],
    SaveData: [],
    MasterSavedData: [],
    isLoadingBarCodeDetail:false,
    isLoadingDODetail:false,
    isLoadingParty: false,
    isLoadingItem: false,
    isLoadingUnit: false,
    isLoadingCurrency: false,
    isLoadingDONO: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isSuccessItemSave: false,
    message: ""
}

export const getDCNO = createAsyncThunk('SDCNO/get', async(userid, thunkAPI)=>{
    try {
        return await partiesService.getDCNO(userid)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getSDDONO = createAsyncThunk('SDDONO/get', async(thunkAPI)=>{
    try {
        return await partiesService.getPDDONO()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getDODetail = createAsyncThunk('SDDODetail/get', async(sdono, thunkAPI)=>{
    try {
        return await partiesService.getDODetail(sdono)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const dataForBarCode = createAsyncThunk('BarCodeDetail/get', async(PDRONO_UserID, thunkAPI)=>{
    try {
        return await partiesService.dataForBarCode(PDRONO_UserID)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const addNewRecord = createAsyncThunk('SD_A_N_R/post', async(userData, thunkAPI)=>{
    try {
        return await partiesService.addNewRecord(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteRecord = createAsyncThunk('SD_D_R/post', async(userData, thunkAPI)=>{
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
            state.isLoadingBarCodeDetail = false
            state.isError = false
            state.isSuccess = false
            state.isSuccessItemSave = false
            state.isLoadingDODetail = false
            state.isLoading = false
            state.message = ""
            state.GRNParties = []
            state.DCNO = []
            state.SDDODetail = []
            state.BarCodeDetail = []
            state.MasterSavedData = []
        }

    },
    extraReducers:(builder)=>{
        builder
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
            .addCase(getSDDONO.pending, (state)=>{
                state.isLoadingDONO = true
            })
            .addCase(getSDDONO.fulfilled, (state, action)=>{
                state.isLoadingDONO = false
                state.isSuccess = true
                state.SDDONO = action.payload
            })
            .addCase(getSDDONO.rejected, (state, action)=>{
                state.isLoadingDONO = false
                state.isError = true
                state.message = action.payload
                state.SDDONO = []
            })
            .addCase(getDODetail.pending, (state)=>{
                state.isLoadingDODetail = true
            })
            .addCase(getDODetail.fulfilled, (state, action)=>{
                state.isLoadingDODetail = false
                state.isSuccess = true
                state.SDDODetail = action.payload
            })
            .addCase(getDODetail.rejected, (state, action)=>{
                state.isLoadingDODetail = false
                state.isError = true
                state.message = action.payload
                state.SDDODetail = []
            })
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
            .addCase(addNewRecord.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(addNewRecord.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccessItemSave = true
                state.SaveData = action.payload
            })
            .addCase(addNewRecord.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.SaveData = []
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