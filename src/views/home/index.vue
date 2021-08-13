<template>
  <div>
    <el-header class="header">
      <div>
        <div class="row-left" style="margin-left: 20px;">
          <h1>{{ groupName }}</h1>
        </div>
        <div class="row-left" style="margin-left: 40px;">
          <h2 style="display: inline-block">目标</h2>
          <span style="margin-left: 20px;">
            <div>
              <span>{{groupCount}} 个</span>
              <span> / </span>
              <span>{{groupTime}} 秒</span>
            </div>
          </span>
        </div>
        <el-button type="danger" circle style="width: 80px; height: 80px; float: right;margin-right: 30px;" @click="handleGroupConfig" >任务分配</el-button>
      </div>
    </el-header>
    <el-main>
      <div></div>
    </el-main>
    <el-drawer
      title="任务分配"
      v-model="drawerStatus"
      direction="rtl"
      :before-close="handleClose" 
      destroy-on-close
      size="35%"
    >
      <div class="row-between" style="margin: 20px;">
        <el-card shadow="always">
          <span class="task-col">待分配数量</span>
          <el-input class="task-col" v-model="taskCount" style="width: 80px;"></el-input>
        </el-card>
        <el-card shadow="always">
          <span class="task-col">待分配时间</span>
          <el-input class="task-col" v-model="taskTime" style="width: 80px;"></el-input>
        </el-card>
      </div>
      <ol id="tasklist" class="slippylist">
        <li v-for="(item, index) in memberList" :key="index">
          <span class="task-col">{{ item.name }}</span>
          <!-- <span>{{ item.count }}</span>
          <span>{{ item.time}} </span> -->
          <el-input class="task-col" v-model="item.target" style="width: 80px;" @focus="handleCacheValue(item.target)" @blur="initNumber('target', item)" ></el-input>
          <el-input class="task-col" v-model="item.time" style="width: 80px;" @focus="handleCacheValue(item.time)" @blur="initNumber('time', item)" ></el-input> 
          <!-- <el-input-number v-model="item.count" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number> -->
        </li>
      </ol>
    </el-drawer>
  </div>
</template>

<script>
import { ref, reactive, computed, watchEffect } from 'vue'
import Slip from '@/utils/slip'

const addTask = (groupCount, groupTime) => {
  let drawerStatus = ref(false)
  let memberList = ref([])
  let taskCount = ref(0)
  let taskTime = ref(0)
  let cacheValue = 0

  const handleClose = (done) => {
    done()
  }

  const setupSlip = (list) => {
    list.addEventListener('slip:beforereorder', function(e){
      if (e.target.classList.contains('demo-no-reorder')) {
          e.preventDefault();
      }
    }, false);

    list.addEventListener('slip:beforeswipe', function(e){
      if (e.target.nodeName == 'INPUT' || e.target.classList.contains('demo-no-swipe')) {
          e.preventDefault();
      }
    }, false);

    list.addEventListener('slip:beforewait', function(e){
      if (e.target.classList.contains('instant')) e.preventDefault();
    }, false);

    list.addEventListener('slip:afterswipe', function(e){
      e.target.parentNode.appendChild(e.target);
    }, false);

    list.addEventListener('slip:reorder', function(e){
      const movedItem = memberList.value[e.detail.originalIndex];
      memberList.value.splice(e.detail.originalIndex, 1); // Remove item from the previous position
      memberList.value.splice(e.detail.spliceIndex, 0, movedItem); // Insert item in the new position

      // e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      return false;
    }, false);

    return new Slip(list)
  }

  const getMemberList = () => {
    return [
      {
        name: '张三',
        count: 160,
        time: 200,
        target: 0
      },
      {
        name: '李四',
        count: 60,
        time: 120,
        target: 0
      },
      {
        name: '小明',
        count: 120,
        time: 220,
        target: 0
      },
      {
        name: '小强',
        count: 80,
        time: 110,
        target: 0
      }
    ]
  }

  // const taskInputChange = _.debounce(asyncTaskData, 200)

  const asyncTaskData = (sum, type) => {
    const finished = memberList.value.reduce((memo, item) => {
      console.log(item[type], memo, 'mmmmmmm')
      memo += +item[type]
      return memo
    }, 0)
    console.log(sum, '====', finished)
    return sum - finished
  }

  const handleCacheValue = value => {
    cacheValue = +value
    console.log(cacheValue, 'cccccccc', value)
  }

  const initNumber = (type, obj) => {

    let grouptask = type === 'time' ? groupTime : groupCount
    let task = type === 'time' ? taskTime : taskCount
    console.log(task.value)
    const number = asyncTaskData(grouptask.value, type)
    
    if(number < 0) {
      obj[type] = task.value + cacheValue
      console.log(memberList.value,'memberList')
      task.value = 0
    }else {
      task.value = number
    }
  }

  const handleGroupConfig = async () => {
    drawerStatus.value = true

    let data = await getMemberList()

    memberList.value = data.map(item => {
      item.target = item.target === 0 ? item.count : item.target
      return item
    })

    initNumber('target')
    initNumber('time')

    setupSlip(document.getElementById('tasklist'))
  }

  return {
    drawerStatus,
    handleClose,
    handleGroupConfig,
    memberList,
    taskCount,
    taskTime,
    asyncTaskData,
    initNumber,
    handleCacheValue
  }

}

const getHomePage= () => {
  let groupName = ref('')
  let groupCount = ref(0)
  let groupTime = ref(0)
  let groupId = ref(0)

  groupName.value = '别跟我们作队'
  groupCount.value = 500
  groupTime.value = 855
  groupId.value = 1

  return {
    groupName,
    groupCount,
    groupTime,
    groupId 
  }
}

export default {
  name: 'home',
  setup() {
    let {groupTime, groupCount} = getHomePage()
    return {
      ...getHomePage(),
      ...addTask(groupCount, groupTime)
    }
  }
}
</script>

<style scoped>
  .header {
    height: 200px; 
    background-color: #66CCCC;
  }

  .row-center {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center; 
  }

  .row-between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center; 
  }

  .row-left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .task-col {
    margin-right: 20px;
  }


  .slippylist li {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    cursor: default;
  }

  /* the rest is junk for the demo page */
  .slippylist li.demo-allow-select {
      padding: 1em;
      line-height: 1.3;
      user-select: text;
      -moz-user-select: text;
      -webkit-user-select: text;
  }
  .slippylist li.demo-allow-select span {
      cursor: text;
  }

  /* body {
      background: #eee;
      font-family: Helvetica, Arial, sans-serif;
      max-width: 40em;
      margin: 0 auto;
      padding: 5px;
  } */

  .slippylist {
      clear:left;
      margin: 1em;
      padding: 0 0 1px;
  }

  .slippylist li {
      display: block;
      position: relative;
      border: 1px solid black;
      background: white;
      margin: 0; padding: 0 1em;
      border-radius: 3px;
      margin-bottom: -1px;
      max-width: 100%;
      line-height: 3;
      vertical-align: middle;
  }

  .slippylist input {
      vertical-align: middle;
  }

  .slippylist .instant::after {
      content: " \2261";
  }
  .slippylist .instant {
      float: right;
  }
</style>