#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=100005;
const int M=200005;
int k,n,f[N],ans[N];

struct TArray{
	int sm[M];
	int lowbit(int x){
		return x&(-x); 
	}
	void add(int x,int d){
		for(int i=x;i<=k;i+=lowbit(i))
			sm[i]+=d; 
	}
	int ask(int x){
		int ans=0;
		for(int i=x;i>0;i-=lowbit(i))
			ans+=sm[i];
		return ans;
	}
}T;

struct node{
	int a,b,c,cnt,id;
}d[N];

bool cmpA(const node& a,const node& b){
	if(a.a!=b.a)return a.a<b.a;
	if(a.b!=b.b)return a.b<b.b;
	return a.c<b.c;
}
bool cmpB(const node& a,const node& b){
	if(a.b!=b.b)return a.b<b.b;
	return a.c<b.c;
}
bool cmpC(const node& a,const node& b){
	return a.c<b.c;
}

void CDQ(int l,int r){
	if(l==r)return;
	int mid=(l+r)>>1;
	CDQ(l,mid);
	CDQ(mid+1,r);
	int cur=l-1;
	for(int i=mid+1;i<=r;i++){
		while(cur+1<=mid&&d[cur+1].b<=d[i].b){
			cur++;
			T.add(d[cur].c,d[cur].cnt);
		}
		f[d[i].id]+=T.ask(d[i].c);
	}
	for(int i=l;i<=cur;i++)
		T.add(d[i].c,-d[i].cnt);
	sort(d+l,d+1+r,cmpB);
}

int main(){
	n=read();k=read();
	for(int i=1;i<=n;i++){
		d[i].a=read();
		d[i].b=read();
		d[i].c=read();
		d[i].cnt=1;
	}
	sort(d+1,d+1+n,cmpA);
	
	int tot=1;
	for(int i=2;i<=n;i++){
		if(d[i].a!=d[tot].a||
		   d[i].b!=d[tot].b||
		   d[i].c!=d[tot].c){
			d[++tot]=d[i];
			d[tot].cnt=1;
		}else d[tot].cnt++;
	}
	for(int i=1;i<=tot;i++)
		d[i].id=i;
	CDQ(1,tot);
	for(int i=1;i<=tot;i++){
		int ni=d[i].cnt;
		int fi=f[d[i].id]+(ni-1);
		ans[fi]+=ni;
	}
	for(int i=0;i<n;i++)
		cout<<ans[i]<<"\n";
	return 0;
}

