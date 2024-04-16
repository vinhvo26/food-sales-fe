<script setup>
import { useSystemStore } from '@/core/store/system'
import { useReportAdminStore } from './store'
import { conventDate } from '@/core/utils/constants.js'

const route = useRoute()
const router = useRouter()
const { setLoading } = useSystemStore()
const useReportAdmin = useReportAdminStore()
const content = ref('')

onMounted(async () => {
  setLoading(true)
  await handleGetDetailReport()
  setLoading(false)
})

const handleGetDetailReport = async () => {
  const res = await useReportAdmin.getDetailReport(route.params.id)
  if (res.status) {
    useReportAdmin.detailReport = res.data
    content.value = useReportAdmin.detailReport.content_report
  }
}
</script>
<template>
  <div>
    <NuxtLayout name="admin">
      <Head>
        <Title
          >Nội dung báo cáo({{
            [
              useReportAdmin.detailReport?.first_name,
              useReportAdmin.detailReport?.last_name,
            ]
              .filter(item => item)
              .join(' ') +
            ' - ' +
            conventDate(useReportAdmin.detailReport?.created_at)
          }})</Title
        >
      </Head>
      <div class="report-main">
        <h1>
          Nội dung báo cáo({{
            [
              useReportAdmin.detailReport?.first_name,
              useReportAdmin.detailReport?.last_name,
            ]
              .filter(item => item)
              .join(' ') +
            ' - ' +
            conventDate(useReportAdmin.detailReport?.created_at)
          }})
        </h1>
        <div class="mt-4">
          <CKEditer v-model="content" disabled />
        </div>
        <div class="w-full flex mt-3 justify-end gap-x-3">
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
<style scoped lang="scss">
.report-main {
  padding: 20px;

  h1 {
    font-size: 25px;
    font-weight: 500;
  }
}
</style>
