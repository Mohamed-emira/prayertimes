import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ar-dz';
moment.locale('ar-dz');

function MainContent() {
  /*-----------------------------------------------start usestate------------------------------------------------------*/
  const [nextPrayerIndex, setnextPrayerIndex] = useState(0);
  const [timings, settimings] = useState({
    Fajr: '04:33',
    Dhuhr: '11:19',
    Asr: '14:26',
    Maghrib: '16:45',
    Isha: '18:15',
  });
  const [RemainingTime, setRemainingTime] = useState('');
  const [selectedCity, setselectedCity] = useState({
    displayName: 'مكة المكرمة',
    apiName: 'Makkah al Mukarramah',
  });
  const [today, settoday] = useState('');
  /*-----------------------------------------------End usestate------------------------------------------------------*/
/*--------------------------------------------start functions-----------------------------------------------------------*/
  const avilableCities = [
    { displayName: 'مكة المكرمة', apiName: 'Makkah al Mukarramah' },
    { displayName: 'الرياض', apiName: 'Riyadh' },
    { displayName: 'الدمام', apiName: 'Dammam' },
  ];

  const prayersArray = [
    { key: 'Fajr', displayName:"الفجر"},
    { key: 'Dhuhr', displayName: 'الظهر' },
    { key: 'Asr', displayName: 'العصر' },
    { key: 'Maghrib', displayName: 'المغرب' },
    { key: 'Isha', displayName: 'العشاء' },
  ];
  const setupCountdownTimer = () => {
    const momentNow = moment();
    let PrayerIndex = 2;
  
    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      PrayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      PrayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      PrayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      PrayerIndex = 4;
    } else {
      PrayerIndex = 0;
    }
    setnextPrayerIndex(PrayerIndex);
      // ... (your existing logic for determining PrayerIndex)


    const nextPrayerObject = prayersArray[PrayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, 'hh:mm');
    let remainingTime = moment(nextPrayerTime, 'hh:mm').diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment('23:59:59', 'hh:mm:ss').diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment('00:00:00', 'hh:mm:ss'));
      const totalDiffernce = midnightDiff + fajrToMidnightDiff;
      remainingTime = totalDiffernce;
    }

    const durationRemainingTime = moment.duration(remainingTime);
    setRemainingTime(
      `${durationRemainingTime.hours()}:${durationRemainingTime.minutes()}:${durationRemainingTime.seconds()}`
    );}
    /*--------------------------------------------End functions-----------------------------------------------------------*/
/*----------------------------------------------start useEffect---------------------------------------------------*/
  useEffect(() => {
    gettimings();
  }, [selectedCity]);

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);
    const t = moment();
    settoday(t.format('MMM Do YYYY | h:mm'));
    return () => {
      clearInterval(interval);
    };
  },[timings]);
/*----------------------------------------------End useEffect---------------------------------------------------*/
  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName === event.target.value;
    });
    setselectedCity(cityObject);
  };
/*--------------------------------------------start get api------------------------------------------------------------*/
  const gettimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity/:date?country=SA&city=${selectedCity.apiName}`
    );
    settimings(response.data.data.timings);
  };
/*--------------------------------------------End get api------------------------------------------------------------*/

  return (
    <>
          <Grid container >
          <Grid xs={6}>
            <div style={{position:"relative",right:"200px"}}>
          <h2>{today}</h2>
          <h1 style={{position:'relative',paddingRight:'30px'}}>{selectedCity.displayName}</h1>
          </div>
        </Grid>
        <Grid xs={6}>
            <div>
          <h2>متبقى حتى صلاه {prayersArray[nextPrayerIndex].displayName}</h2>
          <h1 style={{position:'relative',paddingRight:"60px"}}>{RemainingTime}</h1>
          </div>
        </Grid>
       </Grid>
       <Divider style={{borderColor:"white",opacity:'.4'}}/>
       <Stack direction="row" justifyContent={"space-around"}style={{marginTop:"50px"}}>
       <Prayer name="الفجر" time={timings.Fajr} 	image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"  />
       <Prayer name="الظهر" time={timings.Dhuhr} 	image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"  />
       <Prayer name="العصر" time={timings.Asr} 		image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"/>
       <Prayer name="المغرب" time={timings.Maghrib}	image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5" />
       <Prayer name="العشاء" time={timings.Isha} 	image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"/>
       </Stack>
<Stack direction="row" justifyContent={"center"}>

<FormControl style={{width:'20%',marginTop:'50px'}}>
      <InputLabel id="demo-select-small-label">المدينة</InputLabel>
      <Select style={{color:"white"}}
        labelId="demo-select-small-label"
        id="demo-select-small"
       /* value={age}*/
        label="Age"
        onChange={handleCityChange}>
       {avilableCities.map((city)=>{
        return(        <MenuItem value={city.apiName} key={city.apiName}>{city.displayName}</MenuItem>
        )
       })}

      </Select>
    </FormControl>
</Stack>
    </>
    
  )
    }
export default MainContent;