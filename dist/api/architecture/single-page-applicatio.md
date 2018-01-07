##### シングルページアプリケーション（SPA）が実現するユーザー体験向上とその最大化

　一般的に、ウェブサイトは1つのページに対して1つのHTMLファイルを持っているため、ユーザーが新しいページを見ようとする度にブラウザはHTMLファイルをウェブサーバーに要求する。さらに、そのHTMLファイルの中で関連づけられているリソース（画像ファイル、フォントファイル、CSSファイル、JavaScriptファイルなど）があれば、それらのリソースもサーバーに要求し、サーバーからの応答で取得したファイルをブラウザが解析・表示することで、ユーザーは新しいページを見ることができる。

　つまり、1つのページを意図した通りに表示するために必要なリソースが多ければ多いほど通信量やブラウザの処理負担は大きくなるため、表示するまで時間がかかり、ユーザー体験は低減する。大半のブラウザには一度取得したファイルを保持しておく機能（キャッシュ）があるため、キャッシュ済みのファイルはサーバーに要求しないことで不要な通信量を減らすことはできるが、キャッシュ済みのファイルを表示するための処理がなくなることはない。

　シングルページアプリケーション（Single Page Application 以下、SPA）は上記の課題を解決しうるウェブアプリケーションの設計思想であり、適切に設計・実装すれば通信量やブラウザの処理負担を小さくすることができる。名称の通り、SPAは単一のページしか必要としないため、ブラウザがサーバーに要求するHTMLファイルも1つしかない。

　SPAのウェブサイトでユーザーがページを遷移しようとすると、ブラウザはそのアクションに対して、1つのHTMLファイルの中で変更する必要がある部分だけを書き換えていく。その変更に未取得のリソースが必要であれば、必要なリソースだけをサーバーに要求し、HTMLの書き換えに使用する。この処理はJavaScriptで実装するため、SPAではJavaScriptのコード量が多くなる傾向がある。

　このように、遷移前と遷移後で変更がない部分（例えば、ウェブサイトのグローバルメニューやフッターなど）の表示に要する通信量と処理をなくすことができる。よって、一般的なウェブサイトに比べてユーザーが見たい情報を速く表示することができるため、SPAは高速なユーザー体験の実現が期待できる。

　ただし、SPAは初回アクセス時にその実装であるJavaScriptファイルを取得しなければならない。前述の通り、SPAを実装したJavaScriptファイルのコード量は多くなるため、そのファイルサイズも大きくなる。そのため、初回アクセス時のリソースの取得・処理に時間を要することになるのがSPAのデメリットの一つである。

　初回アクセス時のデメリットをはじめ、SPAの高速なページ遷移のトレードオフとしてデメリットがいくつか発生することは避けられない。開発者はそのデメリットの最小化を考慮した設計・実装をすることで、SPAのユーザー体験を最大化することができる。具体的には、「初回アクセス時のリソースの取得・処理の肥大化」「ブラウザの履歴機能から外れる」「検索サイトのインデックスで不利になる」などが挙げられる。

　「初回アクセス時のリソースの取得・処理の肥大化」のボトルネックとなるリソースのサイズは、開発時にUglifyJS（JavaScript）やcssnano（CSS）といったツールを使って、コードを圧縮することでリソースのサイズを縮小させることができる。また、サーバーからリソースを配信する際にもgzip圧縮することで、通信量を小さくすることもできる。さらに、初回アクセス時に必ず表示される見た目のスタイルがあれば、そのスタイルを外部のCSSファイルに記述するのではなく、HTMLファイルにインラインで記述した方が処理が高速になり、画面を表示するまでのユーザーの待ち時間を短縮することができる。

　「ブラウザの履歴管理から外れる」とは、大半のブラウザの標準機能である閲覧履歴に、SPAの擬似的なページ遷移が残らないことであり、ユーザーが使い慣れている戻る・進むという操作を不可能にしてしまう。なぜなら、SPAではユーザーのアクションに対して単一のHTMLを部分的にを書き換えていくため、URLは変更せず、履歴のリストが追加されないからである。つまり、“ページ遷移をする”という意識でユーザーが行なうアクションに対してHTMLを書き換えた際に、新しいURLをブラウザの履歴に追加することができれば、この問題は解消される。それはwindowオブジェクトが提供しているHistory APIを使うことで実装が可能になり、SPAの擬似的なページ遷移をブラウザの履歴管理と同期することができる。

　「検索サイトのインデックスで不利になる」とは、検索サイトで上位に表示されなくなることである。検索サイトはインターネット上のウェブコンテンツをデータベース化して、検索結果のインデックスに利用している。そのデータベースはクローラと呼ばれるプログラムがウェブコンテンツのデータを収集することで作成される。しかし、SPAはインターネット上にコンテンツごとに個別のHTMLファイルがあるわけではないため、クローラが収集するデータ自体が存在しない。ただし、ブラウザでユーザーのアクションにより生成される擬似的なページと同じHTMLファイルをサーバサイドで生成（サーバサイドレンダリング）すれば、クローラはデータを収取することができる。また、サーバサイドレンダリングをしていれば「初回アクセス時のリソースの取得・処理の肥大化」も解消される。クローラは高性能であり、サーバサイドレンダリングしていないSPAのウェブコンテンンツも正確にインデックスしているとのことだが、SPAの実装には様々な方法があるため、クローラの性能に頼る場合は検証が必要である。

　SPAを導入する際に、これらのデメリットを考慮した設計・実装をするれば、高速なユーザー体験を最大化することができる。