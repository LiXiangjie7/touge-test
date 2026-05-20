<script setup>
import { ref, reactive } from 'vue'
import StudentInfo from './components/StudentInfo.vue'
import ExperimentScore from './components/ExperimentScore.vue'

const student = reactive({
  name: '李湘杰',
  studentId: '202440590420',
  major: '互联网专业',
  className: '互联网24-1班',
  experimentStatus: '已完成',
  baseScore: 88
})

const selfAssessment = reactive({
  score: '',
  feedback: ''
})

const handleSubmit = (data) => {
  selfAssessment.score = data.score
  selfAssessment.feedback = data.feedback
}
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>{{ student.name }}的Vue3组件化实验报告</h1>
      <p class="subtitle">父子组件通信实践</p>
    </header>

    <div class="main-content">
      <StudentInfo
        :name="student.name"
        :student-id="student.studentId"
        :major="student.major"
        :class-name="student.className"
        :experiment-status="student.experimentStatus"
        :base-score="student.baseScore"
      />

      <ExperimentScore @submit="handleSubmit" />
    </div>

    <div v-if="selfAssessment.score || selfAssessment.feedback" class="result-card">
      <h3>实验自评结果</h3>
      <div class="result-item">
        <span class="label">自评分数：</span>
        <span class="value">{{ selfAssessment.score }} 分</span>
      </div>
      <div class="result-item">
        <span class="label">实验心得：</span>
        <p class="feedback-text">{{ selfAssessment.feedback }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.header {
  text-align: center;
  color: #fff;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
}

.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.result-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.result-card h3 {
  color: #667eea;
  margin-bottom: 20px;
  font-size: 20px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.result-item {
  margin-bottom: 16px;
}

.result-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #667eea;
  font-size: 18px;
  font-weight: 600;
}

.feedback-text {
  margin-top: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #555;
  line-height: 1.6;
}
</style>
