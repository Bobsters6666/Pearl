import PDFRenderer from "@/components/PDFRenderer"
import ChatWrapper from "@/components/chat/ChatWrapper"
import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { notFound, redirect } from "next/navigation"

interface PageProps {
  params: {
    fileid: string
  }
}

const page = async ({ params }: PageProps ) => {

  const { fileid } = params 

  const { getUser } = getKindeServerSession()
  const user = getUser()

  if(!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`)

  // make database call
  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id
    }
  })

  if(!file) notFound()

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh - 3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* left side */}
        <div className="flex-1 xl:flex ">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer url={file.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] broder-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={fileid} />
        </div>
      </div>
    </div>
  )
}

export default page