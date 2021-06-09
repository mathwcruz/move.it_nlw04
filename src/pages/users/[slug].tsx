import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect } from "react";

import axios from "axios";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { SideBarNav } from "../../components/SideBarNav";

import { api } from "../../services/api";

import styles from "../../styles/pages/User.module.css";

interface UserData {
  avatarUrl: string;
  name: string;
  bio: string;
  company: string;
  followers: number;
  level: number;
  completedChallenges: number;
  experience: number;
  lastChallengeCompletedDate: string;
  contactLink: string;
}

interface UserRepositoryData {
  name: string;
  description: string;
  mainLanguage: string;
  totalStars: number;
}

interface UserProps {
  userData: UserData;
  userRepositories: UserRepositoryData[];
}

export default function User({
  userData: user,
  userRepositories: repositories,
}: UserProps) {
  const [session, loading] = useSession();
  const router = useRouter();

  console.log({ user, repositories });

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth");
    }
  }, [loading, session]);

  return (
    <>
      <Head>
        <title>{user?.name || "Usuário"} | move.it</title>
      </Head>
      <div className={styles.sideBarNavContainer}>
        <SideBarNav />
        <div className={styles.userContainer}>
          <h1>User: </h1>
          <p>{user?.bio}</p>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("/users", {
    // pegando os 3 usuários com mais desafios completados
    params: {
      _limit: 3,
      _sort: "completed_challenges",
      _order: "desc",
    },
  });

  const paths = data?.map((user) => {
    // esses id's serão gerados de forma estática na hora do build do next
    return {
      params: {
        slug: user?.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking", // os id's que nao estiverem no "paths" irão ser gerados de maneira estática apenas quando forem acessados
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params; // pegando o id do user para fazer as requisições necesárias e mostrar os dados deste usuário

  const { data: userDataChallenge } = await api.get(`/users/${slug}`);
  const { data: userDataGithub } = await axios.get(
    `https://api.github.com/users/${slug}`
  );
  const { data: userRepos } = await axios.get(
    `https://api.github.com/users/${slug}/repos`
  );

  const userFormatted = {
    // formatando os dados do user para o front
    avatarUrl: userDataGithub?.avatar_url,
    name: userDataGithub?.name,
    bio: userDataGithub?.bio,
    company: userDataGithub?.company,
    followers: userDataGithub?.followers,
    level: userDataChallenge?.level,
    completedChallenges: userDataChallenge?.completed_challenges,
    experience: userDataChallenge?.experience,
    lastChallengeCompletedDate: format(
      parseISO(userDataChallenge?.last_challenge_completed_date),
      "dd MMM yyyy",
      {
        locale: ptBR,
      }
    ),
    contactLink: userDataChallenge?.contact_link,
  };

  const someUserRepositories = userRepos.slice(0, 3); // pegando apenas 3 repos do user
  const userRepositoriesFromatted = someUserRepositories?.map((repo) => {
    // formatando os repos do user para o front
    return {
      name: repo?.name,
      description: repo?.description,
      mainLanguage: repo?.language,
      totalStars: repo?.stargazers_count,
    };
  });

  return {
    props: {
      userData: userFormatted,
      userRepositories: userRepositoriesFromatted,
    },
    revalidate: 60 * 20, // => 20 minutos
  };
};
