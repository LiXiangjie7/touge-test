<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const score = ref('')
const feedback = ref('')
const isSubmitting = ref(false)

const handleSubmit = () => {
  if (!score.value || !feedback.value) {
    alert('请填写完整的自评分数和实验心得')
    return
  }

  const scoreNum = parseInt(score.value)
  if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
    alert('请输入有效的分数（0-100）')
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    emit('submit', {
      score: scoreNum,
      feedback: feedback.value
    })
    score.value = ''
    feedback.value = ''
    isSubmitting.value = false
  }, 500)
}

const quickScore = (value) => {
  score.value = String(value)
}
</script>

<template>
  <div class="score-card">
    <h3>实验自评</h3>
    
    <div class="form-group">
      <label>自评分数</label>
      <div class="score-input-group">
        <input
          v-model="score"
          type="number"
          min="0"
          max="100"
          placeholder="请输入分数（0-100）"
          class="score-input"
        />
        <span class="input-suffix">分</span>
      </div>
      <div class="quick-scores">
        <button
          v-for="s in [80, 85, 90, 95, 100]"
          :key="s"
          @click="quickScore(s)"
          class="quick-btn"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>实验心得</label>
      <textarea
        v-model="feedback"
        placeholder="请输入您的实验心得和体会..."
        class="feedback-textarea"
        rows="4"
      ></textarea>
    </div>

    <button
      @click="handleSubmit"
      :disabled="isSubmitting"
      class="submit-btn"
    >
      <span v-if="isSubmitting" class="loading"></span>
      {{ isSubmitting ? '提交中...' : '提交自评' }}
    </button>
  </div>
</template>

<style scoped>
.score-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.score-card h3 {
  color: #667eea;
  margin-bottom: 20px;
  font-size: 20px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.score-input-group {
  position: relative;
}

.score-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.score-input:focus {
  outline: none;
  border-color: #667eea;
}

.input-suffix {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.quick-scores {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.quick-btn {
  padding: 6px 14px;
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-btn:hover {
  background: #667eea;
  color: #fff;
}

.feedback-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s;
}

.feedback-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
