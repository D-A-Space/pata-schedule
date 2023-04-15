import React, { useEffect, useState } from "react";
import { FcPrevious, FcNext } from "react-icons/fc";
function App() {
  const urlParams = new URLSearchParams(window.location.search);
  let team = urlParams.get("team");

const teams = [
  "Arizona-Cardinals",
  "Atlanta-Falcons",
  "Baltimore-Ravens",
  "Buffalo-Bills",
  "Carolina-Panthers",
  "Chicago-Bears",
  "Cincinnati-Bengals",
  "Cleveland-Browns",
  "Dallas-Cowboys",
  "Denver-Broncos",
  "Detroit-Lions",
  "Green-Bay-Packers",
  "Houston-Texans",
  "Indianapolis-Colts",
  "Jacksonville-Jaguars",
  "Kansas-City-Chiefs",
  "Los-Angeles-Chargers",
  "Los-Angeles-Rams",
  "Miami-Dolphins",
  "Minnesota-Vikings",
  "New-England-Patriots",
  "New-Orleans-Saints",
  "New-York-Giants",
  "New-York-Jets",
  "Las-Vegas-Raiders",
  "Philadelphia-Eagles",
  "Pittsburgh-Steelers",
  "San-Francisco-49ers",
  "Seattle-Seahawks",
  "Tampa-Bay-Buccaneers",
  "Tennessee-Titans",
  "Washington-Redskins",
];
  const [season, setSeason] = useState({
    from: new Date().getFullYear(),
    to: new Date().getFullYear() + 1,
  });

  const [data, setData] = useState([]);
 
  const [errors, setErrors] = useState(false);

  const handleButtonClick = (move) => {
 
    const thisYear = new Date().getFullYear();
    if (move === "front" && season.to < thisYear + 1) {
   

   handleSeasonChange(+season.from + 1, +season.to + 1);
      setSeason({
        from: season.from + 1,
        to: season.to + 1,
      });
     
    }
    // the min season is 2020-2021
    else if (move === "back" && season.from > 2020) {
  
      handleSeasonChange(+season.from - 1 , +season.to - 1);
      setSeason({
        from: season.from - 1,
        to: season.to - 1,
      });
 
    }
  };
  const handleSeasonChange = (from , to) => {
        setErrors(false);
     let JSONData = {};
    try {
       JSONData = require(`./schedules/${
         from.toString() + "-" + to.toString()
       }.json`);
    
  
    
     const teamData = JSONData[team];
     if (teamData && teamData.length > 0) {
       setData([...teamData]);
     }else{
        setData([]);
        setErrors(true);
     }

    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    if (!team) {
      return;
    }
    let num = 0;
    let JSONData = {};
    let search = true;
    while (search) {
      console.log(
        "111",
        `./schedules/${
          (+season.from - +num).toString() +
          "-" +
          (+season.to - +num).toString()
        }.json`
      );

      try {
        JSONData = require(`./schedules/${
          (season.from - num).toString() + "-" + (season.to - num).toString()
        }.json`);
        if (
          !Object.keys(JSONData).includes(team) ||
          JSONData[team]?.length === 0
        ) {
          num++;
        } else {
          setSeason({
            from: season.from - num,
            to: season.to - num,
          });

          search = false;
        }
      } catch (e) {
        return;
      }
    }
    // console.log("222", JSONData);
    const teamData = JSONData[team];
    if (teamData && teamData.length > 0) {
      setData(teamData);
    } else {
    }
  }, [team]);
  useEffect(() => {
    console.log("data", data);
  }, [data]);
  const timeZones = [
    "Eastern Times",
    "Central Times",
    "Mountain Times",
    "Pacific Times",
  ];
  return (
    <>
      {!team ? (
        <>
          <div
            style={{
              background:
                "linear-gradient(rgba(0, 0, 0, 0.467), rgba(0, 0, 0, 0)), rgb(17, 34, 51)",
            }}
            className="flex flex-col items-center justify-center gap-2"
          >
            <h1 className="text-white text-4xl">NFL Teams</h1>
            <hr className="mx-auto w-full mb-5" />
            {teams.map((team) => {
              return (
                <>
                  <p onClick={() =>{
                    window.location.href = `/?team=${team}`
                  }} className="text-white text-3xl cursor-pointer">{team}</p>
                  <hr className="mx-auto w-3/4" />
                </>
              );
            })}
          </div>
        </>
      ) : (
        <div
          className="h-screen overflow-auto text-white"
          style={{
            background:
              "linear-gradient(rgba(0, 0, 0, 0.467), rgba(0, 0, 0, 0)), rgb(17, 34, 51)",
          }}
        >
          <div className="flex justify-around items-end ">
            <div
              onClick={() => handleButtonClick("back")}
              className="flex flex-col justify-center items-center bg-gray-700 shadow-md shadow-white/50 active:shadow-sm active:shadow-white/50 p-2 rounded-lg cursor-pointer"
            >
              {/* <small className="">Prev Season</small> */}
              <div className="">
                <FcPrevious />
              </div>
            </div>
            <div className="">
              <div className="text-center text-3xl pt-3 whitespace-nowrap  ">
                {team?.replace("-", " ")}
              </div>
              <div className="flex gap-2 w-full justify-center items-baseline">
                <div className=" text-xl ">Schedule</div>
                <small>{season.from + " / " + season.to}</small>
              </div>
            </div>

            <div
              onClick={() => handleButtonClick("front")}
              className="flex flex-col justify-center items-center bg-gray-700 shadow-md shadow-white/50 active:shadow-sm active:shadow-white/50 p-2 rounded-lg cursor-pointer"
            >
              {/* <small className="text-xs">Next Season</small> */}
              <div className="">
                <FcNext />
              </div>
            </div>
          </div>
          <hr className="w-4/5 mx-auto mt-5" />
          <div className=" flex flex-wrap gap-3 justify-center items-center max-h-full h-3/4 p-5  ">
            {data.length === 0 && errors ? (
              <>
                {/* <div className="flex items-center justify-center"> */}
                <p className="text-3xl ">NO SCHEDULE YET!</p>
                {/* </div> */}
              </>
            ) : (
              data.map((item, index) => (
                <React.Fragment key={index}>
                  <div className=" ">
                    <p className="   text-center w-full text-3xl mb-2 font-bold">
                      {timeZones[index]}
                    </p>
                    <div className="h-full w-full cursor-pointer  overflow-hidden relative rounded-lg">
                      <img
                        onClick={(e) => {
                          if (
                            e.currentTarget.className ===
                            "fixed top-0  left-0 w-full h-full object-scale-down backdrop-blur-3xl z-50"
                          ) {
                            e.currentTarget.className = "h-full object-fill";
                          } else {
                            e.currentTarget.className =
                              "fixed top-0  left-0 w-full h-full object-scale-down backdrop-blur-3xl z-50";
                          }
                        }}
                        src={item.image}
                        className="h-full object-fill"
                        alt=""
                      />
                    </div>
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
