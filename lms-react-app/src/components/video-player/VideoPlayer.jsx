import React, { useRef } from 'react'
import ReactPlayer from 'react-player'

const VideoPlayer = ({width="100%", height="100%", url}) => {

    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const [muted, setMuted] = useState(false)
    const [played, setPlayed] = useState(false)
    const [seeking, setSeeking] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [showControls, setShowControls] = useState(true)

    const playerRef = useRef(null)
    const playerContainerRef = useRef(null)
    const controlsTimeOutRef = useRef(null)

    const togglePlay = () => {
        setPlaying(!playing)
    }

    const handleProgress = () =>{
        if (controlsTimeOutRef.current) clearTimeout(controlsTimeOutRef.current)
          console.log(controlsTimeOutRef.current);
          
        setShowControls(true)
    }

  return (
    <div ref={playerContainerRef}
    className={`${isFullScreen ? 'w-screen h-screen' : ''}`}
    style={{width, height}}
    >

        <ReactPlayer ref={playerRef}
        height={height}
        width={width}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        />
        {
           showControls && <div></div>
        }
    </div>

  )
}

export default VideoPlayer