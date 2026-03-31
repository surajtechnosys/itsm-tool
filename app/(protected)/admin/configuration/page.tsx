import { getConfiguration } from "@/lib/actions/configuration";
import ConfigurationForm from "./configuration-form";

const ConfigurationPage = async () => {
  const config = await getConfiguration(); 

  const formattedConfig = config
    ? {
        ...config,
        name: config.name ?? undefined,
        logo: config.logo ?? undefined,
        favicon: config.favicon ?? undefined,
      }
    : undefined;

  return <ConfigurationForm data={formattedConfig} />;
};

export default ConfigurationPage;
