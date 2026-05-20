<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  experimentStatus: {
    type: String,
    required: true
  },
  baseScore: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="info-card">
    <div class="card-header">
      <div class="avatar">
        <span class="avatar-text">{{ name.charAt(0) }}</span>
      </div>
      <div class="basic-info">
        <h2>{{ name }}</h2>
        <p class="student-id">{{ studentId }}</p>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">专业</span>
        <span class="info-value">{{ major }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">班级</span>
        <span class="info-value">{{ className }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">实验状态</span>
        <span :class="['info-value', 'status', experimentStatus === '已完成' ? 'completed' : 'pending']">
          {{ experimentStatus }}
        </span>
      </div>
      <div class="info-item">
        <span class="info-label">基础分数</span>
        <span class="info-value score">{{ baseScore }} <span class="score-unit">分</span></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: #fff;
  font-size: 28px;
  font-weight: bold;
}

.basic-info {
  flex: 1;
}

.basic-info h2 {
  font-size: 22px;
  color: #333;
  margin-bottom: 4px;
}

.student-id {
  color: #888;
  font-size: 14px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 13px;
  color: #888;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  width: fit-content;
}

.status.completed {
  background: #d4edda;
  color: #155724;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.score {
  color: #667eea;
  font-size: 20px;
  font-weight: 600;
}

.score-unit {
  font-size: 14px;
  font-weight: normal;
  color: #888;
}
</style>
