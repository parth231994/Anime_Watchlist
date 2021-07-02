import React, { useState, useEffect } from 'react'
import './watchlist.css'
import 'date-fns'
import Series from './series'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from "@material-ui/core/Grid"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers"
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { Menu } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

function Watchlist(props){
    const baseUrl = props.baseUrl
    const token = props.token

    const [list, setList] = useState([])
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState() // Create Dialog

    const [title, setTitle] = useState()
    const [episodeLink, setEpisodeLink] = useState()
    const [type, setType] = useState('Not Specified')
    const [previewLink, setPreviewLink] = useState()
    const [episodeNr, setEpisodeNr] = useState('')
    const [episodeTotal, setEpisodeTotal] = useState('')
    const [dateAired, setDateAired] = useState(new Date())

    const fetchWatchlist = async () => {
        if(token){
            setMessage('Loading Watchlist...')
            try{
                const response = await fetch(baseUrl+'/series', {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                })
                const respJson = await response.json()
                if(response.status === 200){
                    setList(respJson);
                    setMessage('');
                }else{
                    setMessage('could not load Watchlist...')
                }
                
            } catch(err){
                setMessage('Unable to load Watchlist.')
                console.log(err)
            }
        }
    }

    useEffect(()=>{fetchWatchlist()}, [])

    const createSeries = async () => {
        setMessage('Saving new Series...')
        try{
            const response = await fetch(baseUrl+'/series', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    title: title, 
                    episodeLink: episodeLink,
                    type: type,
                    preview: previewLink,
                    episodeNr: episodeNr,
                    episodeTotal: episodeTotal,
                    startedAiring: dateAired
                })
            })
            const respJson = await response.json()
            if(response.status === 200){
                setList(list.concat(respJson))
                setMessage('')
                
                setTitle('')
                setEpisodeLink('')
                setType('Not Specified')
                setPreviewLink('')
                setEpisodeNr('')
                setEpisodeTotal('')
                setDateAired(new Date())

            } else {
                setMessage('Could not save Series!')
                console.log(respJson.err)
            }
        } catch(err){
            console.log(err)
            setMessage('Unable to Save Series.')
        }
    }

    const removeSeries = async (id) => {
        const remaining = list.filter( s => {return s._id !== id})
        setMessage('Removing Series...')
        try{
            const response = await fetch(baseUrl+'/series/'+id, {
                method: 'DELETE',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            const respJson = await response.json()
            if(response.status===200){
                setList(remaining)
                setMessage('')
            } else {
                setMessage('Unable to remove Series.')
            }
        } catch(err){
            setMessage('Unable to remove Series.')
            console.log(err)
        }
    }

    const openDialog = () => {
        setOpen(true)
    }
    const closeDialog = () => {
        setOpen(false)
    }

    if(list){
        return(
            <div>
                <Dialog open={open} onClose={closeDialog} aria-labelledby="form-dialog-title" >
                    <DialogTitle id='form-dialog-title'>Create New Series</DialogTitle>
                    <DialogContent>
                        <TextField 
                            margin='normal'
                            required
                            fullWidth
                            id='title'
                            label='Title'
                            name='title'
                            autoComplete='title'
                            onChange={(e)=>{setTitle(e.target.value)}}
                            autoFocus
                        />
                        <TextField 
                            margin='normal'
                            required
                            fullWidth
                            id='episodeLink'
                            label='Link to Episode'
                            name='episodeLink'
                            autoComplete='episodeLink'
                            onChange={(e)=>setEpisodeLink(e.target.value)}
                        />
                        <TextField 
                            margin='normal'
                            fullWidth
                            id='previewLink'
                            label='Link to Preview Image'
                            name='previewLink'
                            autoComplete='previewLink'
                            onChange={(e)=>setPreviewLink(e.target.value)}
                        />
                        <FormControl>
                            <InputLabel id='type-label' >Content Type</InputLabel>
                            <Select 
                                labelId='type-label' 
                                id='type'
                                fullWidth
                                value={type}
                                onChange={(e)=> setType(e.target.value)}
                                >
                                <MenuItem value='TV-Series'>TV-Series</MenuItem>
                                <MenuItem value='Movie'>Movie</MenuItem>
                                <MenuItem value='Original Video Animation (OVA)'>Original Video Animation (OVA)</MenuItem>
                                <MenuItem value='Original Net Animation (ONA)'>Original Net Animation (ONA)</MenuItem>
                                <MenuItem value='Special'>Special</MenuItem>
                                <MenuItem value='Other'>Other</MenuItem>
                                <MenuItem value='Not Specified'>Not Specified</MenuItem>
                            </Select>
                        </FormControl>
                        <Grid container justify="space-around">
                        <TextField 
                            type='number'
                            id='episodeNr'
                            label='Current Episode'
                            name='episodeNr'
                            onChange={(e)=> setEpisodeNr(e.target.value)}
                        />
                        <TextField 
                            type='number'
                            id='episodeTotal'
                            label='Total Episodes'
                            name='episodeTotal'
                            onChange={(e)=> setEpisodeTotal(e.target.value)}
                        />
                        </Grid>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date Series started Airing"
                                    format="dd/MM/yyyy"
                                    value={dateAired}
                                    onChange={(date)=> setDateAired(date)}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date"
                                    }}
                                />
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="Date Series started Airing"
                                    value={dateAired}
                                    onChange={(date)=> setDateAired(date)}
                                    KeyboardButtonProps={{
                                        "aria-label": "change time"
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> { createSeries(); closeDialog() }} color="primary">Create</Button>
                        <Button onClick={closeDialog} color="secondary">Cancel</Button>
                    </DialogActions>
                </Dialog>
                <p id='statusMessasge'>{message}</p>
                <div id='watchlist'>
                    {list.map(s => 
                        <Series series={s} 
                               key={s._id} 
                                token={token}
                                baseUrl={baseUrl}
                                setMessage={setMessage}
                                removeSeries={removeSeries} 
                            />
                    )}

                    <div id='new-series'>
                        {/*TODO Form to Add new Series*/}
                            <Button onClick={()=> openDialog()} >
                                <div>
                                <img src="https://img.icons8.com/metro/26/000000/plus-math.png" width="230" height="240" />
                                <p>Add new Series</p>
                                </div>
                            </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Watchlist