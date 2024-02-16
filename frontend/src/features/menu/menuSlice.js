import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import menuService from './menuService'


const initialState = {
    parentMenu: [],
    childMenu: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

export const getParentMenu = createAsyncThunk('menu/parentMenu', async(userid, thunkAPI)=>{
    try {
        return await menuService.getParentMenu(userid)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getChildMenu = createAsyncThunk('CM/GCM', async(menu_id, thunkAPI)=>{
    try {
        return await menuService.getChildMenu(menu_id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const menuSlice = createSlice({
    name: 'manuParent',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
            state.parentMenu = []
            state.ItemList = []
        }

    },
    extraReducers:(builder)=>{
        builder
            .addCase(getParentMenu.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getParentMenu.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.parentMenu = action.payload
            })
            .addCase(getParentMenu.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.parentMenu = []
            })
            .addCase(getChildMenu.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getChildMenu.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.childMenu = action.payload
            })
            .addCase(getChildMenu.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.childMenu = []
            })

        }
})

export const { reset } = menuSlice.actions

export default menuSlice.reducer