import { useQuery } from "@tanstack/react-query";
import { getAbilities, getHeroAbilities } from "../utils/http";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import styles from "../assets/styles/hero.module.scss";
import { IAbility } from "../types/ability";

type Props = {
  heroName: string;
};

const Abilities: React.FC<Props> = ({ heroName }) => {
  const {
    data: heroAbilities,
    isLoading: isHeroAbilitiesLoading,
    isError: isHeroAbilitiesError,
    error: heroAbilitiesError,
  } = useQuery({
    queryKey: ["hero-abilities", heroName],
    queryFn: () => getHeroAbilities(heroName),
  });

  const {
    data: abilities,
    isLoading: isAbilitiesLoading,
    isError: isAbilitiesError,
    error: abilitiesError,
  } = useQuery({
    queryKey: ["abilities", heroAbilities],
    queryFn: () => getAbilities(heroAbilities),
    enabled: !!heroAbilities,
  });

  if (isHeroAbilitiesLoading || isAbilitiesLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isHeroAbilitiesError || isAbilitiesError) {
    return (
      <Typography>
        {heroAbilitiesError?.message || abilitiesError?.message}
      </Typography>
    );
  }

  return (
    <Container sx={{ marginBottom: "30px" }}>
      <Typography variant="h6" gutterBottom color="textPrimary">
        Hero Abilities
      </Typography>
      {abilities && (
        <Grid container spacing={2}>
          {abilities.map((ability: IAbility) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={ability.dname}
              hidden={!ability.dname}
            >
              <Card className={styles.abilityCard} sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="120"
                  image={`https://cdn.cloudflare.steamstatic.com${ability.img}`}
                  alt={ability.dname}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    fontWeight="bold"
                  >
                    {ability.dname}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {ability.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Abilities;
