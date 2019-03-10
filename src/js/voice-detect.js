
console.log('start')

// const btn = document.querySelector('button')
// const speech = new webkitSpeechRecognition()
// speech.lang = 'ja-JP'
//
// btn.addEventListener('click', () => {
//   // console.log('button clicked!!!')
//   btn.disabled = true
//   speech.start()
// })
//
// speech.onresult = (e) => {
//   console.log(e)
//   speech.stop()
// }

// const player = document.getElementById('player')

let shouldStop = false
let stopped = false
const downloadLink = document.getElementById('download')
const stopButton = document.getElementById('stop')

stopButton.addEventListener('click', function() {
  shouldStop = true
})

const handleSuccess = (stream) => {
  const options = { mimeType: 'video/webm;codecs=vp9' }
  const recordedChunks = []
  const mediaRecorder = new MediaRecorder(stream, options)

  mediaRecorder.ondataavailable = (e) => {
    console.log(e)
    if (e.data.size > 0) {
      recordedChunks.push(e.data)
    }

    if (shouldStop === true && stopped === false) {
      mediaRecorder.stop()
      stopped = true
    }
  }

  mediaRecorder.addEventListener('stop', () => {
    downloadLink.href = URL.createObjectURL(
      new Blob(recordedChunks, { 'type' : 'audio/wav; codecs=MS_PCM' }))
    downloadLink.download = 'acetest.mp3'
  })

  mediaRecorder.start(1000)
}

// const handleSuccess = (stream) => {
//   // if (window.URL) {
//   //   player.src = window.URL.createObjectURL(stream)
//   // } else {
//   //   player.src = stream
//   // }
//   const context = new AudioContext()
//   const input = context.createMediaStreamSource(stream)
//   const processor = context.createScriptProcessor(1024, 1, 1)
//
//   input.connect(processor);
//   processor.connect(context.destination);
//
//   processor.onaudioprocess = (e) => {
//     // Do something with the data, i.e Convert this to WAV
//     console.log(e.inputBuffer);
//   }
// }

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(handleSuccess)
