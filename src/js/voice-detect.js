
import Recorder from './recorder'
console.log('start')

window.AudioContext = window.AudioContext || window.webkitAudioContext
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
window.URL = window.URL || window.webkitURL

const audioContext = new AudioContext()
let mediaRecorder

const stopButton = document.getElementById('stop')
const startButton = document.getElementById('start')

stopButton.addEventListener('click', () => {
  // shouldStop = true
  mediaRecorder && mediaRecorder.stop()
  createDownloadLink()
  mediaRecorder.clear()
})

startButton.addEventListener('click', () => {
  mediaRecorder.record()
})

const handleSuccess = (stream) => {
  let input = audioContext.createMediaStreamSource(stream)
  mediaRecorder = new Recorder(input)
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

navigator.getUserMedia({ audio: true, video: false }, handleSuccess, (e) => {
  console.log(e)
})
