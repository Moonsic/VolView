
import SparkMD5 from 'spark-md5'

// 导入spark-md5库
// importScripts('https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/dist/spark-md5.min.js');

self.addEventListener('message', function (e) {
  console.log('e :>> ', e);
  const data = e.data;

  if (data.action === 'start') {
    const file = data.file;

    // 初始化SparkMD5对象
    const spark = new self.SparkMD5.ArrayBuffer();

    // 创建FileReader对象
    let reader = new FileReader();
    let chunkSize = 2097152; // 每次读取2MB的数据
    let loaded = 0;

    // 读取文件的一部分
    reader.onload = function (e) {
      spark.append(e.target.result); // 使用SparkMD5的append方法追加数据
      loaded += e.loaded;
      console.log('loaded :>> ', loaded);
      if (loaded < file.size) {
        // 如果还有剩余的数据，继续读取
        reader.readAsArrayBuffer(file.slice(loaded, loaded + chunkSize));
      } else {
        // 计算最终的MD5值
        const md5 = spark.end();
        console.log('md5 :>> ', md5);
        self.postMessage(md5);
      }
    };

    // 开始读取文件的第一部分
    reader.readAsArrayBuffer(file.slice(loaded, loaded + chunkSize));
  }

}, false);



// 创建一个新的Worker实例
// const worker = new Worker('./worker.js');

// // 将文件发送给worker
// worker.postMessage({ action: 'start', file: obj.file });

// // 接收worker的消息
// worker.onmessage = function(event) {
//   console.log('event :>> ', event);
//     const result = event.data;
//     // document.getElementById('result').textContent = `MD5: ${result}`;
// };



// // 工作线程中的worker.js
// self.addEventListener('message', async (event) => {
//   console.log('event.data :>> ', event.data);
//   const file = event.data;
//   const reader = new FileReader();
//   const spark = new SparkMD5.ArrayBuffer();

//   reader.onload = function (e) {
//     spark.append(e.target.result);
//     console.log('i:>> ',e.target.result);

//     self.postMessage(spark.end());
//   };
//   reader.onerror = function (error) {
//     self.postMessage(error);
//   };
//   reader.readAsArrayBuffer(file);
// }, false);




// worker.js
// self.onmessage = async function(event) {
//   const data = event.data;
//   // 假设我们仅仅是将数据打印到控制台，并发送回主线程
//   console.log('Message received from main script', data);
//   const result = `Processed ${data}`;
//   postMessage(result);
// };

// // 你可以在这里添加错误处理、关闭处理等其他逻辑
// self.onerror = function(error) {
//   console.error('Worker error:', error);
// };



// self.addEventListener('message', async function(e) {
//   const file = e.data;

//   let reader = new FileReader();
//   let chunks = [];
//   let totalRead = 0;

//   // 读取文件内容
//   reader.onload = async function(e) {
//       chunks.push(new Uint8Array(e.target.result));
//       totalRead += e.target.result.byteLength;
//       if (totalRead < file.size) {
//           // 继续读取下一个chunk
//           self.postMessage(reader.readAsArrayBuffer(file.slice(totalRead)));
//       } else {
//           // 当文件完全读取后，计算MD5
//           let arrayBuffer = mergeChunks(chunks);
//           let md5 = await computeMD5(arrayBuffer);
//           self.postMessage(md5);
//       }
//   };

//   // 开始读取文件的第一个chunk
//   reader.readAsArrayBuffer(file.slice(0));

//   function mergeChunks(chunks) {
//       let totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
//       let result = new Uint8Array(totalLength);
//       chunks.forEach((chunk, index) => {
//           result.set(chunk, index * chunk.length);
//       });
//       return result.buffer;
//   }

//   async function computeMD5(buffer) {
//       const hash = await crypto.subtle.digest('MD5', buffer);
//       return bytesToHex(new Uint8Array(hash));
//   }

//   function bytesToHex(bytes) {
//       return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
//   }
// }, false);