/**
 * 记录所有弹窗，任何时候只提示一个弹窗
 *
 * 开启拦截/停止拦截 应用场景，axios响应拦截中，统一在报错的地方弹窗提示，但是
 * 有少部分逻辑需要自定义弹窗提示内容，不能直接抛出接口返回的message，这时候就可以用stop方法拦截
 *
 * 用法：
 * message.error('本次弹窗不拦截'); // 弹窗
 * message.stop();// 开启拦截，拦截未来10ms以内的弹窗
 * message.error('因为距离紧跟着上面的stop,调用时间在10ms以内，会被拦截'); // 不弹窗
 * message.error('因为距离紧跟着上面的stop,调用时间在10ms以内，也会被拦截'); // 不弹窗
 * message.start('停止拦截') // 停止拦截，在下次开启message.stop()前不拦截
 * message.error('正常提示') // 弹窗
 */


import { Message } from 'element-ui'
// 全局实例
let instance = {
  stopAndNext: false // 控制是否拦截本次弹窗 true-拦截 false-不拦截
};

const customMessage = (options) => {
  // true 拦截 todo options里有一个
  console.log(instance.stopAndNext)
  if (instance.stopAndNext) {
    // // 延时取消拦截，延时时间等于本次弹窗延时时间+10
    // let duration = (options.duration || 0) + 10;
    // setTimeout(() =>{
    //   // 取消拦截
    //   instance.stopAndNext = false;
    // }, duration)
    return
  };

  if(instance  && instance.close) {
    instance.close()
  }

  Message.closeAll()
  // 给instance赋值时保证stopAndNext标识不丢失
  instance = {...instance, ...Message(options)}
}

['error', 'success', 'info', 'warning'].forEach(type => {
  customMessage[type] = options => {
    if(typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return customMessage(options)
  }
})

// 给message实例绑定stop方法
customMessage.stop = () => {
  instance.stopAndNext = true; // 拦截本次提示，并传递给下一个逻辑处理信息
  return customMessage({})
}
// 给message实例绑定start方法
customMessage.start = () => {
  instance.stopAndNext = false; // 放过本次拦截
}

export const message =  customMessage