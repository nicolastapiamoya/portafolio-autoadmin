import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Projects from "@/components/Projects"
import Contact from "@/components/Contact"
import { getAllExperiences, getAllProjects, getAllSocialLinks, getAllSiteConfigs } from "@/lib/cms"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [experiences, projects, socials, configs] = await Promise.all([
    getAllExperiences(),
    getAllProjects(),
    getAllSocialLinks(),
    getAllSiteConfigs(),
  ])

  const configMap = Object.fromEntries(configs.map((c) => [c.key, c.value]))

  return (
    <>
      <Navbar />
      <main>
        <Hero config={configMap} />
        <About experiences={experiences} />
        <Projects projects={projects} />
        <Contact socials={socials} config={configMap} />
      </main>
      <Footer />
    </>
  )
}
