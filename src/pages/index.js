import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import cards from "../data/cards"

import "../styles/home.scss"

export default function IndexPage() {
  return (
    <>
      <SEO title="Home" />

      <main className="card-list-container">
        <ul className="card-list">
          {cards.map(card => (
            <li className="card-list-item">
              <a href={card.href}>
                <article className="card-list-item-body">
                  <h5>{card.subtitle}</h5>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>

                  {card.tags.length &&
                    card.tags.map(tag => (
                      <span className="card-list-item-tag">{tag}</span>
                    ))}
                </article>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
