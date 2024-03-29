import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <div>
        <img src="/404-not-found.svg" alt="Página não encontrada" />
        <p>Esta página não foi encontrada</p>
        <h4>
          Siga para a{" "}
          <Link href="/">
            <a>página inicial</a>
          </Link>
        </h4>
      </div>
    </div>
  );
}
