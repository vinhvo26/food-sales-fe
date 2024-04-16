<script setup>
import { useReportAdminStore } from './store'
import { useSystemStore } from '@/core/store/system.js'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const useReportAdmin = useReportAdminStore()
const { setLoading } = useSystemStore()

const content = ref('')

onMounted(async () => {
  if (route.params.id) {
    await handleGetDetailReport()
  }
})

const handleGetDetailReport = async () => {
  try {
    setLoading(true)
    const res = await useReportAdmin.getDetailReport(route.params.id)
    if (res.status) {
      setLoading(false)
      useReportAdmin.detailReport = res.data
      content.value = useReportAdmin.detailReport.content_report
    } else {
      router.push(PATH.ADMIN_REPORT)
    }
  } catch (e) {
    console.log(e)
  } finally {
    setLoading(false)
  }
}

const handleCreateReport = async () => {
  if (content.value.trim()) {
    try {
      setLoading(true)

      if (route.params.id) {
        const res = await useReportAdmin.editReport({
          report_id: useReportAdmin.detailReport.report_id,
          content_report: content.value,
        })

        if (res.status) {
          toast.add({
            title: 'Notification',
            description: res.message,
            icon: 'i-heroicons-check-circle',
          })
          setLoading(false)
          router.back()
        } else {
          setLoading(false)
          toast.add({
            title: 'Notification',
            description: res.message,
            icon: 'i-heroicons-exclamation-circle-20-solid',
            color: 'red',
          })
        }
        return
      }

      const res = await useReportAdmin.createReport({
        content_report: content.value,
      })

      if (res.status) {
        toast.add({
          title: 'Notification',
          description: res.message,
          icon: 'i-heroicons-check-circle',
        })
        setLoading(false)
        router.back()
      } else {
        setLoading(false)
        toast.add({
          title: 'Notification',
          description: res.message,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
}
</script>
<template>
  <div>
    <NuxtLayout name="admin">
      <Head>
        <Title>{{
          route.params.id ? 'Cập nhật tuyển dụng' : 'Tạo bài tuyển dụng'
        }}</Title>
      </Head>
      <div class="report-main-create">
        <h1>Báo cáo công việc</h1>
        <div class="mt-4">
          <label for="">Nội dung báo cáo</label>
          <CKEditer v-model="content" />
        </div>
        <div class="w-full flex mt-3 justify-end gap-x-3">
          <UButton @click="handleCreateReport" size="lg" label="Lưu báo cáo" />
          <UButton
            @click="router.back()"
            size="lg"
            label="Trở về"
            variant="outline"
          />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped>
.report-main-create {
  padding: 20px;

  h1 {
    font-size: 25px;
    font-weight: 500;
  }
}
</style>
<style>
.report-main-create .ck.ck-editor__editable[role='textbox'] {
  min-height: 600px;
}
</style>
