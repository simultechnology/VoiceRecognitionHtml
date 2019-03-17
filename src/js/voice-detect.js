
import Recorder from './recorder'
console.log('start')

window.AudioContext = window.AudioContext || window.webkitAudioContext
window.URL = window.URL || window.webkitURL

let audioContext
let mediaRecorder
let gumStream

const stopButton = document.getElementById('stop')
const startButton = document.getElementById('start')

stopButton.addEventListener('click', () => {
  // shouldStop = true
  mediaRecorder && mediaRecorder.stop()
  gumStream.getAudioTracks()[0].stop()
  createDownloadLink()
  mediaRecorder.clear()
})

startButton.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess)
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
    const recordingsList = document.getElementById('recordingslist')
    const url = URL.createObjectURL(blob)
    const li = document.createElement('li')
    const au = document.createElement('audio')
    const hf = document.createElement('a')

    au.controls = true
    au.src = url
    hf.href = url
    hf.download = new Date().toISOString() + '.wav'
    hf.innerHTML = hf.download
    li.appendChild(au)
    li.appendChild(hf)
    recordingsList.appendChild(li)
  })
}
