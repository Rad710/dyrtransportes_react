import { DownloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Tabs, Box, Text, Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { getDatabaseBackup } from "../utils/homepage";

function Index({ title }) {
  useEffect(() => {
    document.title = title;
  }, []);

  const [tab, setTab] = useState('ganancias')


  const handleDescargar = async () => {
    await getDatabaseBackup()
  }
  

  return (
    <>
      <Tabs.Root value={tab} onValueChange={(value) => setTab(value)}>
        <Tabs.List>
          <Tabs.Trigger value="ganancias">
            <span className="text-xl">Ganancias</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="estadisticas">
            <span className="text-xl">Estadisticas</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="baseDeDatos">
            <span className="text-xl">Base de Datos</span>
          </Tabs.Trigger>
        </Tabs.List>


        <Box px="4" pt="3" pb="2">
          <Tabs.Content value="ganancias">
            <Text>Ganancias</Text>
          </Tabs.Content>

          <Tabs.Content value="estadisticas">
            <Text>Cosas</Text>
          </Tabs.Content>

          <Tabs.Content value="baseDeDatos">
            <div className="mt-10 text-center">
              <Text size="7">Crea una Copia de Seguridad para respaldar los datos</Text>

              <br />
              <Button mt="6" color="grass" variant="solid" size="4"
                onClick={handleDescargar}
              >
                <DownloadIcon width="20" height="20" /> Descargar Copia
              </Button>
            </div>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </>
  );
}

export default Index;
