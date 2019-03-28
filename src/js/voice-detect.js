
import Recorder from './recorder'
console.log('start')

window.AudioContext = window.AudioContext || window.webkitAudioContext
window.URL = window.URL || window.webkitURL

let audioContext
let mediaRecorder
let gumStream

const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')

startButton.addEventListener('click', () => {
  document.getElementById('result').innerText = 'recording...'
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess)
  startButton.disabled = true
  stopButton.disabled = false
})

stopButton.addEventListener('click', () => {
  // shouldStop = true
  mediaRecorder && mediaRecorder.stop()
  gumStream.getAudioTracks()[0].stop()
  createDownloadLink()
  mediaRecorder.clear()
  startButton.disabled = false
  stopButton.disabled = true
})

const handleSuccess = (stream) => {
  audioContext = new AudioContext()
  gumStream = stream
  let input = audioContext.createMediaStreamSource(stream)
  mediaRecorder = new Recorder(input, { numChannels: 1 })
  mediaRecorder.record()
}

function createDownloadLink () {
  mediaRecorder && mediaRecorder.exportWAV(blob => {
    console.log(blob)
    document.getElementById('result').innerText = 'processing...'
    const reader = new FileReader
    reader.onload = () => {
      const soundFile64 = reader.result.replace(/^data:audio\/(wav|mp3);base64,/, '')
      console.log(soundFile64)
      const data = new FormData()
      data.append('voice-data', soundFile64)
      const oReq = new XMLHttpRequest()
      // oReq.open('POST', 'http://localhost:5000', true);
      oReq.open('POST', 'https://rrtzxtv4ck.execute-api.ap-northeast-1.amazonaws.com/dev', true);
      oReq.onload = (oEvent) => {
        const responseText = oEvent.target.responseText
        console.log(responseText);
        let resultArea = document.getElementById('result')
        if (responseText === 'MA') {
          resultArea.innerText = 'it\'s a male voice'
        } else if (responseText === 'FE') {
          resultArea.innerText = 'it\'s a female voice'
        } else {
          resultArea.innerText = 'difficult to detect'
        }
      }
      oReq.send(data)
    }
    reader.readAsDataURL(blob);
    // const recordingsList = document.getElementById('recordingslist')
    // const url = URL.createObjectURL(blob)
    // const li = document.createElement('li')
    // const au = document.createElement('audio')
    // const hf = document.createElement('a')
    //
    // au.controls = true
    // au.src = url
    // hf.href = url
    // hf.download = new Date().toISOString() + '.wav'
    // hf.innerHTML = hf.download
    // li.appendChild(au)
    // li.appendChild(hf)
    // recordingsList.appendChild(li)
  })
}
